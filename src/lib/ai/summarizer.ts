import OpenAI from "openai";
import type { SupabaseClient } from "@supabase/supabase-js";

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

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey });
}

export async function generateSummary(
  title: string,
  abstract: string
): Promise<string> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Title: ${title}\n\nAbstract: ${abstract}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");
  return content.trim();
}

export async function summarizeAndStore(
  supabase: SupabaseClient,
  paperId: string,
  title: string,
  abstract: string
): Promise<string> {
  const summary = await generateSummary(title, abstract);

  const { error } = await supabase
    .from("papers")
    .update({ summary_ko: summary })
    .eq("id", paperId);

  if (error) {
    console.error("Failed to store summary:", error);
    throw new Error("Failed to store summary");
  }

  return summary;
}

export async function batchSummarize(
  supabase: SupabaseClient,
  limit = 20
): Promise<{ summarized: number; errors: number }> {
  const { data: papers, error } = await supabase
    .from("papers")
    .select("id, title, abstract")
    .not("abstract", "is", null)
    .neq("abstract", "")
    .is("summary_ko", null)
    .order("publication_date", { ascending: false })
    .limit(limit);

  if (error || !papers) {
    console.error("Failed to fetch papers for summarization:", error);
    return { summarized: 0, errors: 0 };
  }

  let summarized = 0;
  let errors = 0;

  for (const paper of papers) {
    try {
      await summarizeAndStore(
        supabase,
        paper.id,
        paper.title,
        paper.abstract
      );
      summarized++;
    } catch (err) {
      console.error(`Summary failed for paper ${paper.id}:`, err);
      errors++;
    }
  }

  return { summarized, errors };
}
