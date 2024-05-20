const determineGEModality = require("./ge");

const determineManufacturer = async (
  run_log,
  manufacturer,
  modality,
  process_datetime
) => {
  try {
    switch (manufacturer) {
      case "GE":
        await determineGEModality(run_log, modality, process_datetime);
        break;
      case "Philips":
        console.log("Process Philips Data");
        break;
      case "Siemens":
        console.log("Process Siemens Data");
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = determineManufacturer;
