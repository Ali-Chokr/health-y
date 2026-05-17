-- Seed medications reference data for development
insert into public.medications (name, description, common_uses, side_effects, interactions)
values
  (
    'Metformin',
    'First-line medication for type 2 diabetes',
    array['Type 2 diabetes', 'Prediabetes', 'PCOS'],
    array['Nausea', 'Diarrhea', 'Headache'],
    array['Certain contrast dyes', 'Alcohol abuse']
  ),
  (
    'Lisinopril',
    'ACE inhibitor for managing blood pressure',
    array['Hypertension', 'Heart failure', 'Coronary artery disease'],
    array['Dry cough', 'Dizziness', 'Fatigue'],
    array['NSAIDs', 'Potassium supplements', 'Diuretics']
  ),
  (
    'Atorvastatin',
    'Statin for managing cholesterol levels',
    array['High cholesterol', 'Cardiovascular disease prevention'],
    array['Muscle pain', 'Liver damage', 'Memory loss'],
    array['Clarithromycin', 'Erythromycin', 'Gemfibrozil']
  ),
  (
    'Levothyroxine',
    'Thyroid hormone replacement',
    array['Hypothyroidism', 'Thyroid cancer'],
    array['Tremor', 'Sweating', 'Anxiety'],
    array['Calcium supplements', 'Iron supplements', 'Antacids']
  ),
  (
    'Omeprazole',
    'Proton pump inhibitor for acid reflux',
    array['GERD', 'Peptic ulcer disease', 'Acid reflux'],
    array['Headache', 'Diarrhea', 'Nausea'],
    array['Clopidogrel', 'Ketoconazole', 'Methotrexate']
  ),
  (
    'Amlodipine',
    'Calcium channel blocker for blood pressure',
    array['Hypertension', 'Angina', 'Coronary artery disease'],
    array['Swelling', 'Headache', 'Dizziness'],
    array['CYP3A4 inhibitors', 'Simvastatin']
  );
