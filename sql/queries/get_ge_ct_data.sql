SELECT
    sys.id AS system_id,
    sys.manufacturer,
    sys.modality,
    ge.capture_datetime,
    ge.host_datetime,
    ge.TYPE,
    ge.data_1,
    ge.num_1,
    ge.date_2,
    ge.host,
    ge.ermes_number,
    ge.exception_class,
    ge.severity,
    ge.file,
    ge.line_number,
    ge.scan_type,
    ge.warning,
    ge.end_msg,
    ge.message
FROM
    systems sys
    JOIN log.ge_ct_gesys ge ON sys.id = ge.system_id
WHERE
    manufacturer = 'GE'
    AND sys.modality = 'CT'
    AND sys.process_log = TRUE
    AND ge.capture_datetime >= NOW() - INTERVAL '30 minutes'
ORDER BY
    sys.id;