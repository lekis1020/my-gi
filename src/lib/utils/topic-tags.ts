import type { TopicTag } from "@/types/filters";

interface TopicSignals {
  title: string;
  abstract: string | null;
  keywords: string[];
  meshTerms: string[];
}

interface TopicConfig {
  label: string;
  terms: string[];
}

const TOPIC_CONFIG: Record<Exclude<TopicTag, "others">, TopicConfig> = {
  ibd: {
    label: "IBD",
    terms: [
      "inflammatory bowel disease",
      "ibd",
      "crohn",
      "crohn disease",
      "ulcerative colitis",
      "microscopic colitis",
      "collagenous colitis",
      "lymphocytic colitis",
    ],
  },
  gerd_motility: {
    label: "GERD & Motility",
    terms: [
      "gastroesophageal reflux",
      "gerd",
      "esophageal motility",
      "achalasia",
      "barrett esophagus",
      "barrett",
      "gastroparesis",
      "esophageal stricture",
      "dysphagia",
    ],
  },
  gi_oncology: {
    label: "GI Oncology",
    terms: [
      "colorectal cancer",
      "colon cancer",
      "rectal cancer",
      "gastric cancer",
      "stomach cancer",
      "esophageal cancer",
      "gastrointestinal stromal tumor",
      "gist",
      "pancreatic cancer",
      "hepatocellular carcinoma",
      "cholangiocarcinoma",
      "gi neoplasm",
      "gastrointestinal neoplasm",
    ],
  },
  hepatology: {
    label: "Hepatology",
    terms: [
      "liver disease",
      "hepatitis",
      "nafld",
      "masld",
      "nonalcoholic fatty liver",
      "metabolic associated steatotic liver",
      "cirrhosis",
      "liver fibrosis",
      "autoimmune hepatitis",
      "liver transplant",
      "hepatic steatosis",
      "portal hypertension",
    ],
  },
  pancreatobiliary: {
    label: "Pancreatobiliary",
    terms: [
      "pancreatitis",
      "acute pancreatitis",
      "chronic pancreatitis",
      "pancreatic",
      "gallstone",
      "cholelithiasis",
      "cholecystitis",
      "cholangitis",
      "primary sclerosing cholangitis",
      "ercp",
      "endoscopic retrograde cholangiopancreatography",
      "biliary",
    ],
  },
  endoscopy: {
    label: "Endoscopy",
    terms: [
      "endoscopy",
      "endoscopic",
      "colonoscopy",
      "upper endoscopy",
      "esophagogastroduodenoscopy",
      "egd",
      "endoscopic ultrasound",
      "eus",
      "endoscopic mucosal resection",
      "emr",
      "endoscopic submucosal dissection",
      "esd",
      "capsule endoscopy",
    ],
  },
  functional_gi: {
    label: "Functional GI",
    terms: [
      "irritable bowel syndrome",
      "ibs",
      "functional dyspepsia",
      "functional gastrointestinal",
      "gut microbiome",
      "gut brain axis",
      "chronic constipation",
      "fecal microbiota transplant",
      "fmt",
      "motility disorder",
    ],
  },
  celiac_nutrition: {
    label: "Celiac & Nutrition",
    terms: [
      "celiac disease",
      "coeliac disease",
      "gluten",
      "gluten sensitivity",
      "enteral nutrition",
      "parenteral nutrition",
      "malabsorption",
      "short bowel syndrome",
      "nutritional deficiency",
    ],
  },
  gi_bleeding: {
    label: "GI Bleeding",
    terms: [
      "gastrointestinal bleeding",
      "gastrointestinal hemorrhage",
      "gi bleeding",
      "upper gi bleeding",
      "lower gi bleeding",
      "variceal bleeding",
      "peptic ulcer bleeding",
      "obscure gi bleeding",
      "melena",
      "hematochezia",
      "hematemesis",
    ],
  },
};

const SOURCE_WEIGHT = {
  title: 2,
  abstract: 1,
  keywords: 3,
  meshTerms: 5,
} as const;

const MIN_SCORE = 2;

export const TOPIC_META: Record<TopicTag, { label: string; className: string }> = {
  ibd: {
    label: "IBD",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  gerd_motility: {
    label: "GERD & Motility",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  gi_oncology: {
    label: "GI Oncology",
    className: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
  hepatology: {
    label: "Hepatology",
    className: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  },
  pancreatobiliary: {
    label: "Pancreatobiliary",
    className: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  endoscopy: {
    label: "Endoscopy",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  functional_gi: {
    label: "Functional GI",
    className: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  celiac_nutrition: {
    label: "Celiac & Nutrition",
    className: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  gi_bleeding: {
    label: "GI Bleeding",
    className: "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  },
  others: {
    label: "Others",
    className: "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

export function classifyPaperTopics(signals: TopicSignals): TopicTag[] {
  const normalizedTitle = normalizeText(signals.title);
  const normalizedAbstract = normalizeText(signals.abstract ?? "");
  const normalizedKeywords = normalizeText(signals.keywords.join(" "));
  const normalizedMesh = normalizeText(signals.meshTerms.join(" "));

  const scored = (Object.keys(TOPIC_CONFIG) as Array<Exclude<TopicTag, "others">>)
    .map((topic) => {
      const { terms } = TOPIC_CONFIG[topic];

      const score =
        scoreSource(normalizedTitle, terms, SOURCE_WEIGHT.title) +
        scoreSource(normalizedAbstract, terms, SOURCE_WEIGHT.abstract) +
        scoreSource(normalizedKeywords, terms, SOURCE_WEIGHT.keywords) +
        scoreSource(normalizedMesh, terms, SOURCE_WEIGHT.meshTerms);

      return { topic, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return ["others"];
  }

  const topScore = scored[0].score;
  const cutoff = Math.max(MIN_SCORE, Math.ceil(topScore * 0.45));

  const selected = scored
    .filter((item) => item.score >= cutoff)
    .slice(0, 3)
    .map((item) => item.topic);

  return selected.length > 0 ? selected : ["others"];
}

function scoreSource(text: string, terms: string[], weight: number): number {
  if (!text) return 0;

  let hits = 0;
  for (const term of terms) {
    if (containsTerm(text, term)) {
      hits += 1;
    }
  }

  return hits * weight;
}

function containsTerm(text: string, term: string): boolean {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;
  return (` ${text} `).includes(` ${normalizedTerm} `);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
