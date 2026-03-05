INSERT INTO journals (name, abbreviation, issn, e_issn, impact_factor, color, slug) VALUES
  -- General Medical (GI-filtered)
  ('The Lancet', 'Lancet', '0140-6736', '1474-547X', 98.40, '#831843', 'lancet'),
  ('New England Journal of Medicine', 'N Engl J Med', '0028-4793', '1533-4406', 96.20, '#7F1D1D', 'nejm'),
  ('BMJ', 'BMJ', '0959-8138', '1756-1833', 93.60, '#1E3A5F', 'bmj'),
  ('JAMA', 'JAMA', '0098-7484', '1538-3598', 63.10, '#312E81', 'jama'),
  ('Annals of Internal Medicine', 'Ann Intern Med', '0003-4819', '1539-3704', 39.20, '#701A75', 'ann-intern-med'),
  ('JAMA Network Open', 'JAMA Netw Open', '2574-3805', NULL, 13.80, '#4C1D95', 'jama-network-open'),

  -- Tier 1: Top GI/Hepatology
  ('Nature Reviews Gastroenterology & Hepatology', 'Nat Rev Gastroenterol Hepatol', '1759-5045', '1759-5053', 45.90, '#991B1B', 'nat-rev-gastroenterol-hepatol'),
  ('The Lancet Gastroenterology & Hepatology', 'Lancet Gastroenterol Hepatol', '2468-1253', '2468-1261', 35.70, '#9F1239', 'lancet-gastroenterol-hepatol'),
  ('Journal of Hepatology', 'J Hepatol', '0168-8278', '1600-0641', 25.70, '#134E4A', 'j-hepatol'),
  ('Gut', 'Gut', '0017-5749', '1468-3288', 24.50, '#1E3A8A', 'gut'),
  ('Hepatology', 'Hepatology', '0270-9139', '1527-3350', 13.50, '#065F46', 'hepatology'),
  ('Clinical Gastroenterology and Hepatology', 'Clin Gastroenterol Hepatol', '1542-3565', '1542-7714', 11.60, '#1D4ED8', 'clin-gastroenterol-hepatol'),

  -- Tier 2: Core GI/Endoscopy
  ('The American Journal of Gastroenterology', 'Am J Gastroenterol', '0002-9270', '1572-0241', 9.40, '#B91C1C', 'am-j-gastroenterol'),
  ('Endoscopy', 'Endoscopy', '0013-726X', '1438-8812', 9.30, '#6D28D9', 'endoscopy'),
  ('Clinical and Molecular Hepatology', 'Clin Mol Hepatol', '2287-2728', '2287-285X', 9.00, '#166534', 'clin-mol-hepatol'),
  ('Journal of Crohn''s and Colitis', 'J Crohns Colitis', '1873-9946', '1876-4479', 8.30, '#0F766E', 'j-crohns-colitis'),
  ('Alimentary Pharmacology & Therapeutics', 'Aliment Pharmacol Ther', '0269-2813', '1365-2036', 7.60, '#1E40AF', 'aliment-pharmacol-ther'),
  ('United European Gastroenterology Journal', 'United European Gastroenterol J', '2050-6406', '2050-6414', 5.80, '#C2410C', 'ueg-journal'),
  ('Digestive Endoscopy', 'Dig Endosc', '0915-5635', '1443-1661', 5.00, '#7E22CE', 'dig-endosc'),

  -- Tier 3: Specialty
  ('Intestinal Research', 'Intest Res', '1598-9100', '2288-1956', 4.70, '#0E7490', 'intest-res'),
  ('Inflammatory Bowel Diseases', 'Inflamm Bowel Dis', '1078-0998', '1536-4844', 4.50, '#BE185D', 'inflamm-bowel-dis'),
  ('Neurogastroenterology and Motility', 'Neurogastroenterol Motil', '1350-1925', '1365-2982', 3.50, '#A16207', 'neurogastroenterol-motil'),
  ('Journal of Neurogastroenterology and Motility', 'J Neurogastroenterol Motil', '2093-0879', '2093-0887', 3.50, '#B45309', 'j-neurogastroenterol-motil'),
  ('Journal of Clinical Gastroenterology', 'J Clin Gastroenterol', '0192-0790', '1539-2031', 3.20, '#4338CA', 'j-clin-gastroenterol'),
  ('Digestive Diseases and Sciences', 'Dig Dis Sci', '0163-2116', '1573-2568', 3.00, '#047857', 'dig-dis-sci'),
  ('Endoscopy International Open', 'Endosc Int Open', '2364-3722', NULL, 2.50, '#9333EA', 'endosc-int-open'),
  ('Korean Journal of Internal Medicine', 'Korean J Intern Med', '1226-3303', '2005-6648', 2.40, '#0369A1', 'korean-j-intern-med'),
  ('VideoGIE', 'VideoGIE', '2468-4481', NULL, 2.00, '#DB2777', 'videogie'),
  ('Korean Journal of Gastroenterology', 'Korean J Gastroenterol', '1598-9992', '2233-6869', 0.70, '#3730A3', 'korean-j-gastroenterol')
ON CONFLICT (abbreviation) DO UPDATE SET
  name = EXCLUDED.name,
  issn = EXCLUDED.issn,
  e_issn = EXCLUDED.e_issn,
  impact_factor = EXCLUDED.impact_factor,
  color = EXCLUDED.color,
  slug = EXCLUDED.slug;
