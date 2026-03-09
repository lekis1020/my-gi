export interface AbstractSection {
  label: string | null;
  text: string;
}

const SECTION_LABELS = [
  "BACKGROUND",
  "BACKGROUND AND AIMS",
  "BACKGROUND AND AIM",
  "BACKGROUND AND OBJECTIVES",
  "BACKGROUND AND PURPOSE",
  "CONTEXT",
  "INTRODUCTION",
  "OBJECTIVE",
  "OBJECTIVES",
  "AIM",
  "AIMS",
  "PURPOSE",
  "RATIONALE",
  "HYPOTHESIS",
  "STUDY AIM",
  "STUDY AIMS",
  "DESIGN",
  "STUDY DESIGN",
  "SETTING",
  "PATIENTS",
  "SUBJECTS",
  "PARTICIPANTS",
  "POPULATION",
  "MATERIALS AND METHODS",
  "MATERIAL AND METHODS",
  "METHODS",
  "METHODS AND MATERIALS",
  "METHODOLOGY",
  "STUDY METHODS",
  "MEASUREMENTS",
  "INTERVENTIONS",
  "MAIN OUTCOME MEASURES",
  "OUTCOME MEASURES",
  "OUTCOMES",
  "PRIMARY OUTCOME",
  "ENDPOINTS",
  "END POINTS",
  "RESULTS",
  "KEY RESULTS",
  "MAIN RESULTS",
  "FINDINGS",
  "OBSERVATIONS",
  "DISCUSSION",
  "INTERPRETATION",
  "CONCLUSION",
  "CONCLUSIONS",
  "SUMMARY",
  "SIGNIFICANCE",
  "CLINICAL SIGNIFICANCE",
  "IMPLICATIONS",
  "CLINICAL IMPLICATIONS",
  "TRIAL REGISTRATION",
  "CLINICAL TRIAL REGISTRATION",
  "WHAT IS ALREADY KNOWN",
  "WHAT THIS STUDY ADDS",
  "WHAT IS NEW HERE",
  "LAY SUMMARY",
];

// Build regex: match label at start of string or after whitespace, followed by colon
const labelPattern = SECTION_LABELS.map((l) => l.replace(/\s+/g, "\\s+")).join("|");
const sectionRegex = new RegExp(
  `(?:^|(?<=\\s))(?:(?<label>${labelPattern}))\\s*[:.]\\s*`,
  "gi"
);

export function parseAbstract(abstract: string): AbstractSection[] {
  const sections: AbstractSection[] = [];
  const matches = [...abstract.matchAll(sectionRegex)];

  if (matches.length === 0) {
    return [{ label: null, text: abstract.trim() }];
  }

  // Text before the first section label
  const preamble = abstract.slice(0, matches[0].index).trim();
  if (preamble) {
    sections.push({ label: null, text: preamble });
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const label = match.groups?.label ?? match[1];
    const startIdx = match.index! + match[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : abstract.length;
    const text = abstract.slice(startIdx, endIdx).trim();

    if (text) {
      // Title-case the label
      const formatted = label
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\bAnd\b/g, "and");
      sections.push({ label: formatted, text });
    }
  }

  return sections;
}
