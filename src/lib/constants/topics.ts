export interface SubTopic {
  label: string;
  searchQuery: string;
}

export interface TopicCategory {
  id: string;
  label: string;
  searchQuery: string;
  colorClass: string;
  subtopics: SubTopic[];
}

export const TOPIC_TREE: TopicCategory[] = [
  {
    id: "ibd",
    label: "IBD",
    searchQuery: "inflammatory bowel disease",
    colorClass: "text-red-500",
    subtopics: [
      { label: "Crohn's Disease", searchQuery: "crohn disease" },
      { label: "Ulcerative Colitis", searchQuery: "ulcerative colitis" },
      { label: "IBD Biologics", searchQuery: "inflammatory bowel disease biologics" },
      { label: "Pediatric IBD", searchQuery: "pediatric inflammatory bowel disease" },
      { label: "IBD Surgery", searchQuery: "inflammatory bowel disease surgery" },
      { label: "Microscopic Colitis", searchQuery: "microscopic colitis" },
    ],
  },
  {
    id: "gerd_motility",
    label: "GERD & Motility",
    searchQuery: "gastroesophageal reflux",
    colorClass: "text-amber-500",
    subtopics: [
      { label: "GERD", searchQuery: "gastroesophageal reflux disease" },
      { label: "Esophageal Motility", searchQuery: "esophageal motility" },
      { label: "Achalasia", searchQuery: "achalasia" },
      { label: "Barrett's Esophagus", searchQuery: "barrett esophagus" },
      { label: "Gastroparesis", searchQuery: "gastroparesis" },
      { label: "Esophageal Stricture", searchQuery: "esophageal stricture" },
    ],
  },
  {
    id: "gi_oncology",
    label: "GI Oncology",
    searchQuery: "gastrointestinal neoplasms",
    colorClass: "text-rose-500",
    subtopics: [
      { label: "Colorectal Cancer", searchQuery: "colorectal cancer" },
      { label: "Gastric Cancer", searchQuery: "gastric cancer" },
      { label: "Esophageal Cancer", searchQuery: "esophageal cancer" },
      { label: "GI Stromal Tumor", searchQuery: "gastrointestinal stromal tumor" },
      { label: "Pancreatic Cancer", searchQuery: "pancreatic cancer" },
      { label: "Hepatocellular Carcinoma", searchQuery: "hepatocellular carcinoma" },
    ],
  },
  {
    id: "hepatology",
    label: "Hepatology",
    searchQuery: "liver diseases",
    colorClass: "text-violet-500",
    subtopics: [
      { label: "NAFLD / MASLD", searchQuery: "nonalcoholic fatty liver disease" },
      { label: "Hepatitis B", searchQuery: "hepatitis B" },
      { label: "Hepatitis C", searchQuery: "hepatitis C" },
      { label: "Liver Cirrhosis", searchQuery: "liver cirrhosis" },
      { label: "Autoimmune Hepatitis", searchQuery: "autoimmune hepatitis" },
      { label: "Liver Transplant", searchQuery: "liver transplantation" },
    ],
  },
  {
    id: "pancreatobiliary",
    label: "Pancreatobiliary",
    searchQuery: "pancreatic diseases",
    colorClass: "text-orange-500",
    subtopics: [
      { label: "Acute Pancreatitis", searchQuery: "acute pancreatitis" },
      { label: "Chronic Pancreatitis", searchQuery: "chronic pancreatitis" },
      { label: "Gallstone Disease", searchQuery: "gallstone" },
      { label: "Cholangiocarcinoma", searchQuery: "cholangiocarcinoma" },
      { label: "Primary Sclerosing Cholangitis", searchQuery: "primary sclerosing cholangitis" },
      { label: "ERCP", searchQuery: "endoscopic retrograde cholangiopancreatography" },
    ],
  },
  {
    id: "endoscopy",
    label: "Endoscopy",
    searchQuery: "endoscopy",
    colorClass: "text-blue-500",
    subtopics: [
      { label: "Colonoscopy", searchQuery: "colonoscopy" },
      { label: "EUS", searchQuery: "endoscopic ultrasound" },
      { label: "EMR / ESD", searchQuery: "endoscopic mucosal resection" },
      { label: "Capsule Endoscopy", searchQuery: "capsule endoscopy" },
      { label: "AI in Endoscopy", searchQuery: "artificial intelligence endoscopy" },
      { label: "Therapeutic Endoscopy", searchQuery: "therapeutic endoscopy" },
    ],
  },
  {
    id: "functional_gi",
    label: "Functional GI",
    searchQuery: "functional gastrointestinal disorders",
    colorClass: "text-cyan-500",
    subtopics: [
      { label: "IBS", searchQuery: "irritable bowel syndrome" },
      { label: "Functional Dyspepsia", searchQuery: "functional dyspepsia" },
      { label: "Gut Microbiome", searchQuery: "gut microbiome" },
      { label: "Gut-Brain Axis", searchQuery: "gut brain axis" },
      { label: "Chronic Constipation", searchQuery: "chronic constipation" },
    ],
  },
  {
    id: "celiac_nutrition",
    label: "Celiac & Nutrition",
    searchQuery: "celiac disease",
    colorClass: "text-green-500",
    subtopics: [
      { label: "Celiac Disease", searchQuery: "celiac disease" },
      { label: "Gluten Sensitivity", searchQuery: "gluten sensitivity" },
      { label: "Enteral Nutrition", searchQuery: "enteral nutrition" },
      { label: "Malabsorption", searchQuery: "malabsorption" },
      { label: "Short Bowel Syndrome", searchQuery: "short bowel syndrome" },
    ],
  },
  {
    id: "gi_bleeding",
    label: "GI Bleeding",
    searchQuery: "gastrointestinal hemorrhage",
    colorClass: "text-red-600",
    subtopics: [
      { label: "Upper GI Bleeding", searchQuery: "upper gastrointestinal bleeding" },
      { label: "Lower GI Bleeding", searchQuery: "lower gastrointestinal bleeding" },
      { label: "Variceal Bleeding", searchQuery: "variceal bleeding" },
      { label: "Obscure GI Bleeding", searchQuery: "obscure gastrointestinal bleeding" },
      { label: "Peptic Ulcer Bleeding", searchQuery: "peptic ulcer bleeding" },
    ],
  },
];

/** Set of all built-in search queries (lowercased) for migration dedup */
export const BUILTIN_QUERIES = new Set(
  TOPIC_TREE.flatMap((cat) => [
    cat.searchQuery.toLowerCase(),
    ...cat.subtopics.map((s) => s.searchQuery.toLowerCase()),
  ])
);
