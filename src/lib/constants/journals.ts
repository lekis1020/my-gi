export interface JournalConfig {
  name: string;
  abbreviation: string;
  issn: string;
  eIssn: string | null;
  impactFactor: number | null;
  color: string;
  slug: string;
  pubmedQuery: string;
}

export const JOURNALS: JournalConfig[] = [
  {
    name: "Gastroenterology",
    abbreviation: "Gastroenterology",
    issn: "0016-5085",
    eIssn: "1528-0012",
    impactFactor: 25.9,
    color: "#DC2626",
    slug: "gastroenterology",
    pubmedQuery: '"Gastroenterology"[ta] AND "0016-5085"[is]',
  },
  {
    name: "Clinical Endoscopy",
    abbreviation: "Clin Endosc",
    issn: "2234-2400",
    eIssn: "2234-2443",
    impactFactor: 13.3,
    color: "#7C3AED",
    slug: "clinical-endoscopy",
    pubmedQuery: '"Clin Endosc"[ta]',
  },
  {
    name: "Gut and Liver",
    abbreviation: "Gut Liver",
    issn: "1976-2283",
    eIssn: "2005-1212",
    impactFactor: 12.9,
    color: "#0D9488",
    slug: "gut-and-liver",
    pubmedQuery: '"Gut Liver"[ta]',
  },
  {
    name: "International Journal of Gastrointestinal Intervention",
    abbreviation: "Int J Gastrointest Interv",
    issn: "2636-0004",
    eIssn: null,
    impactFactor: 9.0,
    color: "#2563EB",
    slug: "ijgi",
    pubmedQuery: '"Int J Gastrointest Interv"[ta]',
  },
  {
    name: "Gastrointestinal Endoscopy",
    abbreviation: "Gastrointest Endosc",
    issn: "0016-5107",
    eIssn: "1097-6779",
    impactFactor: 7.7,
    color: "#EA580C",
    slug: "gastrointestinal-endoscopy",
    pubmedQuery: '"Gastrointest Endosc"[ta]',
  },
  {
    name: "World Journal of Gastroenterology",
    abbreviation: "World J Gastroenterol",
    issn: "1007-9327",
    eIssn: "2219-2840",
    impactFactor: 5.4,
    color: "#059669",
    slug: "world-j-gastroenterol",
    pubmedQuery: '"World J Gastroenterol"[ta]',
  },
  {
    name: "Journal of Gastrointestinal Surgery",
    abbreviation: "J Gastrointest Surg",
    issn: "1091-255X",
    eIssn: "1873-4626",
    impactFactor: 3.45,
    color: "#D97706",
    slug: "j-gastrointest-surg",
    pubmedQuery: '"J Gastrointest Surg"[ta]',
  },
  {
    name: "Journal of Gastrointestinal Oncology",
    abbreviation: "J Gastrointest Oncol",
    issn: "2078-6891",
    eIssn: "2219-679X",
    impactFactor: 2.2,
    color: "#E11D48",
    slug: "j-gastrointest-oncol",
    pubmedQuery: '"J Gastrointest Oncol"[ta]',
  },
];
