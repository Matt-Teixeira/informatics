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
    console.log(db_obj);
    parsed_data.push(db_obj);
  }
};

const parse_3 = (process_datetime, row, parsed_data) => {
  const scan_meta_data_re = /Scan\sPrep:\sProspective\sExam:\s(?<prospective_exam>\d+).*Protocol:\s(?<protocol>\d+\.\d+)/;
  const orientation_re = /Patient Orientation\((?<orientation>.*?)\).*Position\((?<position>.*)\)/;
  const group_block_re = /(?<group_block>Group\(\d\).*)/g;

  const group_block_data = row.message.match(group_block_re);

  console.log("group_block_data");
  console.log(group_block_data);
};

module.exports = { parse_1, parse_2, parse_3 };

/* 
[
  'Group(1) ; Group Type(Scout) : Start Loc(200.000) : End Loc(-150.000)',
  'Group(2) ; Group Type(Scout) : Start Loc(200.000) : End Loc(-150.000)'
]
*/
