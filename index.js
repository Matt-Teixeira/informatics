("use strict");
require("dotenv").config();

// JOBS
const determineManufacturer = require("./jobs/log/index");

// TOOLS
const { captureDatetime } = require("./tools");

// UTILS
const db = require("./utils/db/pg-pool");
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog
] = require("./utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("./utils/logger/enums");

async function runJob(run_log, process_group, manufacturer, modality) {
  const process_datetime = captureDatetime();
  let note = {
    process_datetime,
    process_group,
    manufacturer,
    modality
  };
  await addLogEvent(I, run_log, "runJob", cal, note, null);

  switch (process_group) {
    case "mag":
      console.log("Running mag processing");
      break;
    case "log":
      await determineManufacturer(
        run_log,
        manufacturer,
        modality,
        process_datetime
      );
      break;
    default:
      break;
  }
}

const onBoot = async () => {
  const process_group = process.argv[2];
  const manufacturer = process.argv[3] || null;
  const modality = process.argv[4] || null;

  const run_log = await makeAppRunLog();
  let note = {
    LOGGER: process.env.LOGGER,
    PG_USER: process.env.PG_USER,
    PG_DB: process.env.PG_DB
  };

  await addLogEvent(I, run_log, "onBoot", cal, note, null);

  console.time();
  await runJob(run_log, process_group, manufacturer, modality);
  console.timeEnd();

  await writeLogEvents(run_log);
};

onBoot();
