const process_ge_ct = require("./ge_ct");

const determineGEModality = async (run_log, modality, process_datetime) => {
  try {
    switch (modality) {
      case "CT":
        await process_ge_ct(run_log, process_datetime);
        break;
      case "CV":
        console.log("Running GE CV");
        break;
      case "MRI":
        console.log("Running GE MRI");
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = determineGEModality;
