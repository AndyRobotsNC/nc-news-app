const db = require("../db/connection");

exports.getTopicsData = () => {
  return db.query(`SELECT * FROM topics `).then((topics) => {
    return topics.rows;
  });
};
exports.fetchArticleData = async (id) => {
  const article = await db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      return rows;
    });
  const commentsInfo = await db.query(`
    SELECT articles.article_id, 
    COUNT(comment_id) AS number_of_comments 
    FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    GROUP BY articles.article_id;`);

  return Promise.all([article, commentsInfo]).then(
    ([article, commentsInfo]) => {
      const articleComments = commentsInfo.rows.find(
        (comment) => comment.article_id === article[0].article_id
      );
      article[0].comment_count = parseInt(articleComments.number_of_comments);
      return article[0];
    }
  );
};
