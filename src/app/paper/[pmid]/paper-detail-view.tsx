"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
import { getPubMedUrl, getDoiUrl } from "@/lib/utils/url";
import { TOPIC_META } from "@/lib/utils/topic-tags";
import type { TopicTag, AuthorSummary } from "@/types/filters";
import { ArrowLeft, ExternalLink, Quote, BookOpen, Users, Calendar, Hash } from "lucide-react";

interface PaperDetail {
  id: string;
  pmid: string;
  doi: string | null;
  title: string;
  abstract: string | null;
  publication_date: string;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  keywords: string[];
  mesh_terms: string[];
  citation_count: number | null;
  journal_name: string;
  journal_abbreviation: string;
  journal_color: string;
  journal_impact_factor: number | null;
  topic_tags: TopicTag[];
  authors: AuthorSummary[];
}

export function PaperDetailView({ paper }: { paper: PaperDetail }) {
  const citation = [
    paper.journal_abbreviation,
    paper.volume && `${paper.volume}`,
    paper.issue && `(${paper.issue})`,
    paper.pages && `:${paper.pages}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to timeline
      </Link>

      <article>
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${paper.journal_color}20`,
              color: paper.journal_color,
              border: `1px solid ${paper.journal_color}33`,
            }}
          >
            {paper.journal_abbreviation
              .split(" ")
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {paper.journal_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {paper.journal_impact_factor && `IF ${paper.journal_impact_factor} · `}
              {citation}
            </p>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          {paper.title}
        </h1>

        {paper.topic_tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {paper.topic_tags.map((tag) => {
              const meta = TOPIC_META[tag] ?? TOPIC_META.others;
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.className}`}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(paper.publication_date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Hash className="h-3.5 w-3.5" />
            PMID: {paper.pmid}
          </span>
          {paper.citation_count !== null && paper.citation_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <Quote className="h-3.5 w-3.5" />
              {paper.citation_count} citations
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {paper.authors.length} authors
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href={getPubMedUrl(paper.pmid)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <BookOpen className="h-4 w-4" />
            PubMed <ExternalLink className="h-3 w-3" />
          </a>
          {paper.doi && (
            <a
              href={getDoiUrl(paper.doi)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              DOI <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {paper.abstract && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Abstract
            </h2>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {paper.abstract}
            </p>
          </section>
        )}

        {paper.authors.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Authors
            </h2>
            <div className="space-y-2">
              {paper.authors.map((author, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {author.last_name}
                    {author.first_name && `, ${author.first_name}`}
                  </span>
                  {author.affiliation && (
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                      — {author.affiliation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {paper.keywords.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {paper.mesh_terms.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              MeSH Terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {paper.mesh_terms.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
