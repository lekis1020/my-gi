import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error("Missing env vars. Run with: node --env-file=.env.local scripts/batch-summarize.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const SYSTEM_PROMPT = `You are a medical abstract summarizer. Summarize the given paper abstract into a structured Korean bullet-point format.

## Output Structure

1. **Title line**: Bold, single-line Korean title summarizing the study
2. **Study overview** (bullet list):
   - 목적: research aim in one sentence
   - 방법: design, data sources, tools/instruments, inclusion criteria
   - 규모: N studies/patients, countries if stated
3. **핵심 결과** (bullet list):
   - Key quantitative findings with effect sizes
   - Group comparisons (vs format)
   - Clinical interpretation of main conclusion
4. **Comment** (single line):
   - Prefixed with "💬 Comment:"
   - One sentence highlighting either: (a) a clinically actionable implication, or (b) a gap/limitation suggesting a specific direction for further research.
   - Be concrete — avoid generic statements like "추가 연구가 필요하다." Instead specify what aspect warrants investigation or how findings could change practice.
5. **Footnote definitions** (optional):
   - If the abstract introduces domain-specific terms central to interpretation (e.g., a disability index, a novel biomarker), append a short definition prefixed with "*" at the bottom.
   - Skip if all terms are standard medical vocabulary.

## Statistical Formatting Rules

| Element | Format | Example |
|---------|--------|---------|
| Prevalence/rate with CI | **value%**[lower-upper] | **29.6%**[22.6-37.1] |
| Odds ratio with CI | OR value[lower-upper] | OR 3.13[1.74-5.64] |
| Hazard ratio with CI | HR value[lower-upper] | HR 0.82[0.71-0.95] |
| Risk ratio with CI | RR value[lower-upper] | RR 1.45[1.12-1.88] |
| p-value | p=value or p<value | p=0.003 |

- Omit "95% CI" label; the bracket notation implies it.
- Bold the primary effect estimate (percentage or key metric).
- Use dash (-) as separator inside brackets, not comma or "to".

## Comparison Format

Use "vs" for group comparisons on the same line:
활동성 IBD **56.9%**[20.3-89.9] vs 비활동성 **27.0%**[3.3-62.0]

Indent sub-findings (e.g., OR derived from the comparison) beneath.

## Language

- Output in Korean.
- Keep medical terms in English where standard (e.g., IBD, OR, HR).
- Translate study design terms to Korean (체계적 문헌고찰, 메타분석, 코호트, 횡단면).

## Tone

Concise, no filler. Each bullet should be self-contained and scannable.`;

const BATCH_SIZE = 50;
const CONCURRENCY = 5;

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

async function summarize(title, abstract) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Title: ${title}\n\nAbstract: ${abstract}` },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });
  return response.choices[0]?.message?.content?.trim();
}

async function processChunk(papers) {
  const results = await Promise.allSettled(
    papers.map(async (paper) => {
      const title = decodeHtmlEntities(paper.title);
      const abstract = decodeHtmlEntities(paper.abstract);
      const summary = await summarize(title, abstract);
      if (!summary) throw new Error("Empty response");

      const { error } = await supabase
        .from("papers")
        .update({ summary_ko: summary })
        .eq("id", paper.id);

      if (error) throw error;
      return paper.id;
    })
  );

  let ok = 0, fail = 0;
  for (const r of results) {
    if (r.status === "fulfilled") ok++;
    else {
      fail++;
      console.error("  Error:", r.reason?.message || r.reason);
    }
  }
  return { ok, fail };
}

async function main() {
  // Count total
  const { count } = await supabase
    .from("papers")
    .select("id", { count: "exact", head: true })
    .not("abstract", "is", null)
    .neq("abstract", "")
    .is("summary_ko", null);

  console.log(`Papers needing summary: ${count}`);
  if (!count) return;

  let totalOk = 0, totalFail = 0, offset = 0;

  while (true) {
    const { data: papers, error } = await supabase
      .from("papers")
      .select("id, title, abstract")
      .not("abstract", "is", null)
      .neq("abstract", "")
      .is("summary_ko", null)
      .order("publication_date", { ascending: false })
      .limit(BATCH_SIZE);

    if (error || !papers?.length) break;

    console.log(`\nBatch: ${papers.length} papers (${totalOk + totalFail} done so far)`);

    // Process in chunks of CONCURRENCY
    for (let i = 0; i < papers.length; i += CONCURRENCY) {
      const chunk = papers.slice(i, i + CONCURRENCY);
      const { ok, fail } = await processChunk(chunk);
      totalOk += ok;
      totalFail += fail;
      process.stdout.write(`  Progress: ${totalOk}/${count} ok, ${totalFail} errors\r`);
    }

    console.log(`  Batch done. Total: ${totalOk} ok, ${totalFail} errors`);
  }

  console.log(`\nComplete! Summarized: ${totalOk}, Errors: ${totalFail}`);
}

main().catch(console.error);
