// Pulls prospective_exam and protocol data at start sequence
const parse_1 = (process_datetime, row, parsed_data) => {
  let exam_start =
    /Start: Prospective Exam:\s?(?<prospective_exam>\d+).*Protocol:\s(?<protocol>\d+\.\d+)?/;
  let exam_start_matches = row.message.match(exam_start);
  if (exam_start_matches) {
    parsed_data.push({
      system_id: row.system_id,
      process_datetime,
      capture_datetime: row.capture_datetime,
      host_datetime: row.host_datetime,
      host_state: "start",
      prospective_exam: exam_start_matches.groups.prospective_exam,
      protocol: exam_start_matches.groups.protocol
    });
  }
};

const parse_2 = (process_datetime, row, parsed_data) => {
  let db_obj = {};

  const exam_end_re =
    /Prospective Exam:\s?(?<prospective_exam>\d+).*Protocol:\s(?<protocol>\d+\.\d+)?/;
  const series_block_re = /(?<series_block>Series:.*)/g;
  const serise_data_re =
    /(?<serise>\d+).*Scans:\s(?<scans>\d+).*\sImages:\s(?<images>\d+)/;

  if (!row.end_msg) return;

  const exam_end_matches = row.end_msg.match(exam_end_re);
  const series_block_matches = row.message.match(series_block_re);

  for (let serise of series_block_matches) {
    if (exam_end_matches) {
      db_obj.system_id = row.system_id;
      db_obj.process_datetime = process_datetime;
      db_obj.capture_datetime = row.capture_datetime;
      db_obj.host_datetime = row.host_datetime;
      db_obj.host_state = "end";
      db_obj.prospective_exam = exam_end_matches.groups.prospective_exam;
      db_obj.protocol = exam_end_matches.groups.protocol;
    }
    if (row.message) {
      const serise_data = serise.match(serise_data_re);

      if (serise_data) {
        db_obj.serise = serise_data.groups.serise;
        db_obj.scans = serise_data.groups.scans;
        db_obj.images = serise_data.groups.images;
      }
    }
    parsed_data.push(db_obj);
  }
};

const parse_3 = (process_datetime, row, parsed_data) => {
  let db_obj = {};
  const scan_meta_data_re =
    /Scan\sPrep:\sProspective\sExam:\s(?<prospective_exam>\d+).*Protocol:\s(?<protocol>\d+\.\d+)/;

  const orientation_re =
    /Patient Orientation\((?<orientation>.*?)\).*Position\((?<position>.*)\)/;

  const group_block_re = /(?<group_block>Group\(\d\).*)/g;
  const scan_group_re =
    /Group\((?<scan_group>\d+)\).*Group\sType\((?<group_type>\w+)\).*Start\sLoc\((?<start_loc>\d+\.?\d+)\).*End\sLoc\((?<end_loc>-?\d+.?\d+)\)/;

  const group_block_data = row.message.match(group_block_re);

  if (!group_block_data) return;

  for (let data of group_block_data) {
    let scan_meta_data = row.message.match(scan_meta_data_re);
    let scan_group_data = data.match(scan_group_re);
    let orientation_data = row.message.match(orientation_re);

    db_obj.system_id = row.system_id;
    db_obj.process_datetime = process_datetime;
    db_obj.capture_datetime = row.capture_datetime;
    db_obj.host_datetime = row.host_datetime;
    db_obj.prospective_exam = scan_meta_data.groups.prospective_exam;
    db_obj.protocol = scan_meta_data.groups.protocol;

    if (!scan_group_data) continue;

    db_obj.scan_group = scan_group_data.groups.scan_group;
    db_obj.group_type = scan_group_data.groups.group_type;
    db_obj.start_loc = scan_group_data.groups.start_loc;
    db_obj.end_loc = scan_group_data.groups.end_loc;

    if (!orientation_data) continue;
    db_obj.orientation = orientation_data.groups.orientation;
    db_obj.position = orientation_data.groups.orientation;
  }

  parsed_data.push(db_obj);
};

const parse_tube = (process_datetime, row, parsed_data) => {
  const unit_map = {
    celsius: "C",
    fahrenheit: "F"
  };
  let db_obj = {};
  // before/after cold warmup
  const before_cold_warmup_re =
    /Tube\stemperature\sbefore\sCold\sTube\sWarmup\sis\s(?<tube_temp>\d+.?\d+)\sdegrees\s(?<unit>\w+)/;
  const after_cold_warmup_re =
    /Tube\stemperature\safter\sCold\sTube\sWarmup\sis\s(?<tube_temp>\d+.?\d+)\sdegrees\s(?<unit>\w+)/;

  const before_warmup_data = row.message.match(before_cold_warmup_re);
  const after_warmup_data = row.message.match(after_cold_warmup_re);

  if (before_warmup_data) {
    db_obj.system_id = row.system_id;
    db_obj.process_datetime = process_datetime;
    db_obj.capture_datetime = row.capture_datetime;
    db_obj.host_datetime = row.host_datetime;
    db_obj.host_state = "before_warmup";
    db_obj.tube_temp = before_warmup_data.groups.tube_temp;
    db_obj.unit = unit_map[before_warmup_data.groups.unit.toLowerCase()];

    parsed_data.push(db_obj);
  }
  if (after_warmup_data) {
    db_obj.system_id = row.system_id;
    db_obj.process_datetime = process_datetime;
    db_obj.capture_datetime = row.capture_datetime;
    db_obj.host_datetime = row.host_datetime;
    db_obj.host_state = "after_warmup";
    db_obj.tube_temp = after_warmup_data.groups.tube_temp;
    db_obj.unit = unit_map[after_warmup_data.groups.unit.toLowerCase()];

    parsed_data.push(db_obj);
  }
};

module.exports = { parse_1, parse_2, parse_3, parse_tube };
