const { QueryFile } = require("pg-promise");
const { join: joinPath } = require("path");

// HELPER FOR LINKING TO EXTERNAL QUERY FILES
const sql = (file) => {
  const fullPath = joinPath(__dirname, file); // GENERATING FULL PATH;
  return new QueryFile(fullPath, { minify: true });
};

module.exports = {
    get_hhm_data: {
      ge_ct: sql("queries/get_ge_ct_data.sql"),
    }
  };