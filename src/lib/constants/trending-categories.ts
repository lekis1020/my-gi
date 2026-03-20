export interface TrendingCategory {
  id: string;
  label: string;
  searchQuery: string;
  excludeTerms: string[];
}

export const TRENDING_CATEGORIES: TrendingCategory[] = [
  {
    id: "ibd",
    label: "IBD",
    searchQuery: '"inflammatory bowel disease" OR "crohn" OR "ulcerative colitis"',
    excludeTerms: [
      "inflammatory bowel disease", "ibd", "crohn", "ulcerative colitis",
      "colitis", "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "gerd_motility",
    label: "GERD & Motility",
    searchQuery: '"gastroesophageal reflux" OR "esophageal motility" OR "achalasia"',
    excludeTerms: [
      "gastroesophageal reflux", "gerd", "esophageal motility",
      "achalasia", "barrett", "gastroparesis",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "gi_oncology",
    label: "GI Oncology",
    searchQuery: '"colorectal cancer" OR "gastric cancer" OR "esophageal cancer"',
    excludeTerms: [
      "colorectal cancer", "colon cancer", "gastric cancer",
      "esophageal cancer", "gastrointestinal neoplasm",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "hepatology",
    label: "Hepatology",
    searchQuery: '"liver disease" OR "hepatitis" OR "cirrhosis" OR "nafld"',
    excludeTerms: [
      "liver disease", "hepatitis", "cirrhosis", "nafld", "masld",
      "hepatology", "liver",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "pancreatobiliary",
    label: "Pancreatobiliary",
    searchQuery: '"pancreatitis" OR "pancreatic" OR "biliary" OR "cholangitis"',
    excludeTerms: [
      "pancreatitis", "pancreatic", "biliary", "cholangitis",
      "gallstone", "ercp",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "endoscopy",
    label: "Endoscopy",
    searchQuery: '"endoscopy" OR "colonoscopy" OR "endoscopic"',
    excludeTerms: [
      "endoscopy", "endoscopic", "colonoscopy", "egd",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "functional_gi",
    label: "Functional GI",
    searchQuery: '"irritable bowel syndrome" OR "functional dyspepsia" OR "gut microbiome"',
    excludeTerms: [
      "irritable bowel syndrome", "ibs", "functional dyspepsia",
      "gut microbiome", "constipation",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "gi_bleeding",
    label: "GI Bleeding",
    searchQuery: '"gastrointestinal hemorrhage" OR "gi bleeding" OR "variceal"',
    excludeTerms: [
      "gastrointestinal hemorrhage", "gi bleeding",
      "variceal", "peptic ulcer", "melena",
      "gastroenterology", "gastrointestinal",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
  {
    id: "others",
    label: "Others",
    searchQuery: "gastroenterology OR hepatology",
    excludeTerms: [
      "gastroenterology", "hepatology", "gastrointestinal",
      "inflammatory bowel disease", "crohn", "ulcerative colitis",
      "gastroesophageal reflux", "colorectal cancer", "gastric cancer",
      "liver disease", "hepatitis", "pancreatitis",
      "endoscopy", "irritable bowel syndrome",
      "gastrointestinal hemorrhage",
      "inflammation", "cytokines", "biomarkers",
    ],
  },
];
