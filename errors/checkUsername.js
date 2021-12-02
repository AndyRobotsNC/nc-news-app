const db = require("../db/connection");

exports.checkValidUsername = async (tableColumn, username, table) => {
  if (!isNaN(username)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid username",
    });
  } else {
    const { rows } = await db.query(
      `SELECT * FROM ${table} WHERE ${tableColumn} = $1;`,
      [username]
    );
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "User does not exist",
      });
    }
  }
};
