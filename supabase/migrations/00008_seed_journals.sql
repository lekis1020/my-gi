INSERT INTO journals (name, abbreviation, issn, e_issn, impact_factor, color, slug) VALUES
  ('Gastroenterology', 'Gastroenterology', '0016-5085', '1528-0012', 25.90, '#DC2626', 'gastroenterology'),
  ('Clinical Endoscopy', 'Clin Endosc', '2234-2400', '2234-2443', 13.30, '#7C3AED', 'clinical-endoscopy'),
  ('Gut and Liver', 'Gut Liver', '1976-2283', '2005-1212', 12.90, '#0D9488', 'gut-and-liver'),
  ('International Journal of Gastrointestinal Intervention', 'Int J Gastrointest Interv', '2636-0004', NULL, 9.00, '#2563EB', 'ijgi'),
  ('Gastrointestinal Endoscopy', 'Gastrointest Endosc', '0016-5107', '1097-6779', 7.70, '#EA580C', 'gastrointestinal-endoscopy'),
  ('World Journal of Gastroenterology', 'World J Gastroenterol', '1007-9327', '2219-2840', 5.40, '#059669', 'world-j-gastroenterol'),
  ('Journal of Gastrointestinal Surgery', 'J Gastrointest Surg', '1091-255X', '1873-4626', 3.45, '#D97706', 'j-gastrointest-surg'),
  ('Journal of Gastrointestinal Oncology', 'J Gastrointest Oncol', '2078-6891', '2219-679X', 2.20, '#E11D48', 'j-gastrointest-oncol')
ON CONFLICT (abbreviation) DO UPDATE SET
  name = EXCLUDED.name,
  issn = EXCLUDED.issn,
  e_issn = EXCLUDED.e_issn,
  impact_factor = EXCLUDED.impact_factor,
  color = EXCLUDED.color,
  slug = EXCLUDED.slug;
