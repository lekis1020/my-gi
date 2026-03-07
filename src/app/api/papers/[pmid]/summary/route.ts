import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { summarizeAndStore } from "@/lib/ai/summarizer";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";
import { rateLimit } from "@/lib/utils/rate-limit";

const limiter = rateLimit({ windowMs: 60_000, maxRequests: 10 });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pmid: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { success } = limiter.check(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const { pmid } = await params;
  if (!pmid || !/^\d+$/.test(pmid)) {
    return NextResponse.json({ error: "Invalid PMID" }, { status: 400 });
  }

  // Check auth
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Fetch paper basics
  const { data: paper, error } = await supabase
    .from("papers")
    .select("id, title, abstract")
    .eq("pmid", pmid)
    .single();

  if (error || !paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  // Check for cached summary (separate query to avoid schema cache issues)
  const { data: summaryRow } = await supabase
    .from("papers")
    .select("summary_ko")
    .eq("id", paper.id)
    .single();

  if (summaryRow?.summary_ko) {
    return NextResponse.json({ summary: summaryRow.summary_ko });
  }

  // No abstract to summarize
  if (!paper.abstract) {
    return NextResponse.json(
      { error: "No abstract available" },
      { status: 400 }
    );
  }

  // Generate summary
  try {
    const title = decodeHtmlEntities(paper.title);
    const abstract = decodeHtmlEntities(paper.abstract);
    const summary = await summarizeAndStore(supabase, paper.id, title, abstract);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summary generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
