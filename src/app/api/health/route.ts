import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/utils/rate-limit";

const limiter = rateLimit({ windowMs: 60_000, maxRequests: 30 });

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { success, resetAt } = limiter.check(ip);

  if (!success) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  const supabase = createAnonClient();

  // Database connectivity check
  let dbOk = false;
  try {
    const { error } = await supabase
      .from("papers")
      .select("id", { count: "exact", head: true });
    dbOk = !error;
  } catch {
    dbOk = false;
  }

  // Last sync freshness check
  let syncOk = false;
  try {
    const { data, error } = await supabase
      .from("sync_logs")
      .select("completed_at")
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      const ageMs = Date.now() - new Date(data.completed_at).getTime();
      syncOk = ageMs <= 24 * 60 * 60 * 1000;
    }
  } catch {
    syncOk = false;
  }

  const allOk = dbOk && syncOk;

  const response = NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  );

  response.headers.set("Cache-Control", "no-cache, no-store");

  return response;
}
