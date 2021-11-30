const db = require("../db/connection");

exports.getTopicsData = () => {
  return db.query(`SELECT * FROM topics `).then((topics) => {
    return topics.rows;
  });
};
exports.fetchArticleData = (id) => {
  return db
    .query(
      `
  SELECT * FROM articles WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
