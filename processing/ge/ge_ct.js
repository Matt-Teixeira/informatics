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

module.exports = { parse_1 };
