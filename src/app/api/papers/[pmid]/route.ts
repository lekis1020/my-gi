import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { classifyPaperTopics } from "@/lib/utils/topic-tags";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pmid: string }> }
) {
  const { pmid } = await params;

  if (!pmid || !/^\d+$/.test(pmid)) {
    return NextResponse.json({ error: "Invalid PMID" }, { status: 400 });
  }

  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from("papers")
    .select(
      `
      id, pmid, doi, title, abstract, publication_date,
      volume, issue, pages, keywords, mesh_terms, citation_count, journal_id,
      journals!inner (id, name, abbreviation, color, slug, impact_factor),
      paper_authors (last_name, first_name, initials, affiliation, position)
    `
    )
    .eq("pmid", pmid)
    .order("position", { referencedTable: "paper_authors", ascending: true })
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  const journal = data.journals as unknown as Record<string, unknown>;
  const authors = (data.paper_authors as unknown as Record<string, unknown>[]) || [];
  const keywords = Array.isArray(data.keywords)
    ? data.keywords.filter((k): k is string => typeof k === "string").map(decodeHtmlEntities)
    : [];
  const meshTerms = Array.isArray(data.mesh_terms)
    ? data.mesh_terms.filter((t): t is string => typeof t === "string").map(decodeHtmlEntities)
    : [];
  const decodedTitle = decodeHtmlEntities(String(data.title ?? ""));
  const decodedAbstract =
    typeof data.abstract === "string" ? decodeHtmlEntities(data.abstract) : null;
  const topicTags = classifyPaperTopics({
    title: decodedTitle,
    abstract: decodedAbstract,
    keywords,
    meshTerms,
  });

  const paper = {
    id: data.id,
    pmid: data.pmid,
    doi: data.doi,
    title: decodedTitle,
    abstract: decodedAbstract,
    publication_date: data.publication_date,
    volume: data.volume,
    issue: data.issue,
    pages: data.pages,
    keywords,
    mesh_terms: meshTerms,
    citation_count: data.citation_count,
    journal_id: data.journal_id,
    journal_name: journal.name,
    journal_abbreviation: journal.abbreviation,
    journal_color: journal.color,
    journal_slug: journal.slug,
    journal_impact_factor: journal.impact_factor,
    topic_tags: topicTags,
    authors: authors.map((a) => ({
      last_name: a.last_name,
      first_name: a.first_name,
      initials: a.initials,
      affiliation: a.affiliation,
      position: a.position,
    })),
  };

  const response = NextResponse.json({ paper });
  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
  return response;
}
