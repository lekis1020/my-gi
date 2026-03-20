import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { classifyPaperTopics } from "@/lib/utils/topic-tags";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAnonClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fromDate = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: rows, error } = await supabase
    .from("papers")
    .select(
      `
      id, pmid, doi, title, abstract, publication_date,
      volume, issue, pages, keywords, mesh_terms, citation_count,
      journal_id,
      journals!inner(id, name, abbreviation, color, slug),
      paper_authors(last_name, first_name, initials, affiliation, position)
    `,
    )
    .gte("publication_date", fromDate)
    .not("abstract", "is", null)
    .neq("abstract", "")
    .order("citation_count", { ascending: false, nullsFirst: false })
    .order("publication_date", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const papers = (rows ?? []).map((row: Record<string, unknown>) => {
    const journal = row.journals as Record<string, unknown>;
    const authors = (row.paper_authors as Record<string, unknown>[]) ?? [];

    const title = decodeHtmlEntities((row.title as string) ?? "");
    const abstract = row.abstract ? decodeHtmlEntities(row.abstract as string) : null;
    const keywords = ((row.keywords as string[]) ?? []).map(decodeHtmlEntities);
    const meshTerms = ((row.mesh_terms as string[]) ?? []).map(decodeHtmlEntities);

    return {
      id: row.id,
      pmid: row.pmid,
      doi: row.doi,
      title,
      abstract,
      publication_date: row.publication_date,
      volume: row.volume,
      issue: row.issue,
      pages: row.pages,
      keywords,
      mesh_terms: meshTerms,
      citation_count: row.citation_count,
      journal_id: row.journal_id,
      journal_name: journal.name,
      journal_abbreviation: journal.abbreviation,
      journal_color: journal.color,
      journal_slug: journal.slug,
      topic_tags: classifyPaperTopics({
        title,
        abstract,
        keywords,
        meshTerms,
      }),
      authors: authors
        .sort(
          (a: Record<string, unknown>, b: Record<string, unknown>) =>
            (a.position as number) - (b.position as number),
        )
        .map((a: Record<string, unknown>) => ({
          last_name: a.last_name,
          first_name: a.first_name,
          initials: a.initials,
          affiliation: a.affiliation,
          position: a.position,
        })),
    };
  });

  return NextResponse.json(
    { papers, generatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
