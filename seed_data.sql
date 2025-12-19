DO $$
DECLARE
    v_subject_id uuid;
BEGIN
    -- 1. Adult Health
    INSERT INTO subjects (name) VALUES ('Adult Health') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Cardiovascular System', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Respiratory System', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Gastrointestinal System', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Endocrine System', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Neurological System', v_subject_id);

    -- 2. Leadership & Management
    INSERT INTO subjects (name) VALUES ('Leadership & Management') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Delegation and Supervision', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Prioritization of Care', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Legal and Ethical Issues', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Health Care Policy', v_subject_id);

    -- 3. Child Health
    INSERT INTO subjects (name) VALUES ('Child Health') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Growth and Development', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Pediatric Emergencies', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Congenital Anomalies', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Infectious Diseases', v_subject_id);

    -- 4. Mental Health
    INSERT INTO subjects (name) VALUES ('Mental Health') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Anxiety and Obsessive-Compulsive Disorders', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Depressive and Bipolar Disorders', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Schizophrenia Spectrum', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Personality Disorders', v_subject_id);

    -- 5. Nutrition
    INSERT INTO subjects (name) VALUES ('Nutrition') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Nutritional Needs Across the Lifespan', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Therapeutic Diets', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Enteral and Parenteral Nutrition', v_subject_id);

    -- 6. Pharmacology
    INSERT INTO subjects (name) VALUES ('Pharmacology') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Anti-Infectives', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Cardiovascular Medications', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Psychotropic Medications', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Pain Management', v_subject_id);

    -- 7. Fundamentals
    INSERT INTO subjects (name) VALUES ('Fundamentals') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Safety and Infection Control', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Basic Nursing Skills', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Fluid, Electrolyte, and Acid-Base Balance', v_subject_id);

    -- 8. Maternal & Newborn Health
    INSERT INTO subjects (name) VALUES ('Maternal & Newborn Health') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Prenatal Care', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Labor and Delivery', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Postpartum Care', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Newborn Care', v_subject_id);

    -- 9. Critical Care
    INSERT INTO subjects (name) VALUES ('Critical Care') RETURNING id INTO v_subject_id;
        INSERT INTO chapters (name, subject_id) VALUES ('Hemodynamic Monitoring', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Mechanical Ventilation', v_subject_id);
        INSERT INTO chapters (name, subject_id) VALUES ('Shock and Multi-Organ Dysfunction', v_subject_id);

END $$;
