const pgp = require("pg-promise")();

const pg_tables = {
  ge: {
    info_ge_ct: new pgp.helpers.TableName({
      table: "ge_ct",
      schema: "info"
    })
  }
};

const pg_column_sets = {
  info: {
    ge: {
      ge_ct: new pgp.helpers.ColumnSet(
        [
          "system_id",
          "process_datetime",
          "capture_datetime",
          "host_datetime",
          "host_state",
          "prospective_exam",
          "protocol",
          "serise",
          "scans",
          "images",
          "scan_group",
          "group_type",
          "start_loc",
          "end_loc",
          "orientation",
          "position",
          "tube_temp",
          "unit"
        ],
        { table: pg_tables.ge.info_ge_ct }
      )
    }
  }
};

module.exports = { pg_tables, pg_column_sets };
