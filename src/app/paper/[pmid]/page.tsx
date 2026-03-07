import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/server";
import { classifyPaperTopics } from "@/lib/utils/topic-tags";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";
import { PaperDetailView } from "./paper-detail-view";

interface Props {
  params: Promise<{ pmid: string }>;
}

async function getPaper(pmid: string) {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from("papers")
    .select(
      `
      id, pmid, doi, title, abstract, publication_date,
      volume, issue, pages, keywords, mesh_terms, citation_count, summary_ko, journal_id,
      journals!inner (id, name, abbreviation, color, slug, impact_factor),
      paper_authors (last_name, first_name, initials, affiliation, position)
    `
    )
    .eq("pmid", pmid)
    .order("position", { referencedTable: "paper_authors", ascending: true })
    .single();

  if (error || !data) return null;

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

  return {
    id: data.id as string,
    pmid: data.pmid as string,
    doi: data.doi as string | null,
    title: decodedTitle,
    abstract: decodedAbstract,
    publication_date: data.publication_date as string,
    volume: data.volume as string | null,
    issue: data.issue as string | null,
    pages: data.pages as string | null,
    keywords,
    mesh_terms: meshTerms,
    citation_count: data.citation_count as number | null,
    summary_ko: (data.summary_ko as string) || null,
    journal_id: data.journal_id as string,
    journal_name: journal.name as string,
    journal_abbreviation: journal.abbreviation as string,
    journal_color: journal.color as string,
    journal_slug: journal.slug as string,
    journal_impact_factor: journal.impact_factor as number | null,
    topic_tags: topicTags,
    authors: authors.map((a) => ({
      last_name: a.last_name as string,
      first_name: a.first_name as string | null,
      initials: a.initials as string | null,
      affiliation: a.affiliation as string | null,
      position: a.position as number,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pmid } = await params;
  const paper = await getPaper(pmid);
  if (!paper) return { title: "Paper Not Found" };

  const authorNames = paper.authors
    .slice(0, 3)
    .map((a) => a.last_name)
    .join(", ");

  return {
    title: `${paper.title} - My GI`,
    description: paper.abstract?.slice(0, 200) || `${authorNames} - ${paper.journal_abbreviation}`,
  };
}

export default async function PaperPage({ params }: Props) {
  const { pmid } = await params;
  const paper = await getPaper(pmid);
  if (!paper) notFound();

  return <PaperDetailView paper={paper} />;
}
