import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server-auth";

export async function GET() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_read_papers")
    .select("paper_id, read_at")
    .eq("user_id", user.id)
    .order("read_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ readPapers: data });
}

export async function POST(request: Request) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const paperId = body.paper_id;

  if (!paperId || typeof paperId !== "string") {
    return NextResponse.json({ error: "paper_id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_read_papers")
    .upsert(
      { user_id: user.id, paper_id: paperId },
      { onConflict: "user_id,paper_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
