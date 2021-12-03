const db = require("../db/connection");

exports.checkValidUsername = async (tableColumn, username, table) => {
  if (!isNaN(username)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid username type",
    });
  } else {
    const { rows } = await db.query(
      `SELECT * FROM ${table} WHERE ${tableColumn} = $1;`,
      [username]
    );
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "User not found",
      });
    }
  }
};
exports.checkCommentID = async (tableColumn, comment_id, table) => {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  } else {
    const { rows } = await db.query(
      `SELECT * FROM ${table} WHERE ${tableColumn} = $1;`,
      [comment_id]
    );
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Comment not found",
      });
    }
  }
};
