CREATE TABLE IF NOT EXISTS info.ge_ct (
    system_id TEXT,
    process_datetime TIMESTAMP WITH TIME ZONE,
    capture_datetime TIMESTAMP WITH TIME ZONE,
    host_datetime TIMESTAMP WITH TIME ZONE,
    host_state TEXT,
    prospective_exam TEXT,
    protocol INT
);
