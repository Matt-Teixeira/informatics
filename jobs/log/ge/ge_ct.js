const { get_ge_ct_data } = require("../../../sql/qf-provider");
const map_to_schema = require("../../../tools/mapToSchema");

const { parse_1 } = require("../../../processing/ge/ge_ct");
const { ge_ct_schema } = require("../../../sql/schemas/ge_ct");

// UTILS
const db = require("../../../utils/db/pg-pool");
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog
] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("../../../utils/logger/enums");

const { v4: uuidv4 } = require("uuid");

const process_ge_ct = async (run_log, process_datetime) => {
  let note = {};
  const job_id = uuidv4();
  await addLogEvent(I, run_log, "process_ge_ct", cal, null, null);

  const rows_to_process = await get_ge_ct_data(run_log);

  const parsed_data = [];

  for (let row of rows_to_process) {
    parse_1(process_datetime, row, parsed_data);
  }

  const mapped_data = map_to_schema(parsed_data, ge_ct_schema);
  console.log(mapped_data);
};

module.exports = process_ge_ct;
