const db = require("../utils/db/pg-pool");
const { get_hhm_data } = require("./sql");

// UTILS
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog
] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("../utils/logger/enums");

const get_ge_ct_data = async (run_log, argsArray) => {
  addLogEvent(I, run_log, "get_ge_ct_data-sql", cal, { args: argsArray }, null);
  try {
    return db.any(get_hhm_data.ge_ct, argsArray);
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "runJob", cat, { args: argsArray }, error);
  }
};

module.exports = { get_ge_ct_data };
