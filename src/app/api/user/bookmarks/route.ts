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
    .from("user_bookmarks")
    .select("paper_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarks: data });
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
    .from("user_bookmarks")
    .upsert({ user_id: user.id, paper_id: paperId }, { onConflict: "user_id,paper_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const paperId = searchParams.get("paper_id");

  if (!paperId) {
    return NextResponse.json({ error: "paper_id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("paper_id", paperId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
