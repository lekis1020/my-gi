import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { batchSummarize } from "@/lib/ai/summarizer";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const limit = Math.min(
    Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "50", 10) || 50),
    200
  );

  const supabase = createServiceClient();

  // Count remaining papers without summary
  const { count } = await supabase
    .from("papers")
    .select("id", { count: "exact", head: true })
    .not("abstract", "is", null)
    .neq("abstract", "")
    .is("summary_ko", null);

  const remaining = count || 0;

  const results = await batchSummarize(supabase, limit);

  return NextResponse.json({
    ...results,
    remaining: remaining - results.summarized,
    message: `Summarized ${results.summarized} papers. ${remaining - results.summarized} remaining.`,
  });
}
