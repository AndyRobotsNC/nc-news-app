const db = require("../db/connection");

exports.getTopicsData = () => {
  return db.query(`SELECT * FROM topics `).then((topics) => {
    return topics.rows;
  });
};
exports.fetchAllArticles = async (sort_by, order_by) => {
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    sort_by = "created_at";
  }
  if (order_by != "asc") {
    order_by = "desc";
  }

  const articles = db
    .query(`SELECT * FROM articles ORDER BY ${sort_by} ${order_by};`)
    .then((articles) => {
      return articles.rows;
    });
  const commentsInfo = await db.query(`
    SELECT articles.article_id, 
    COUNT(comment_id) AS number_of_comments 
    FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    GROUP BY articles.article_id;`);

  return Promise.all([articles, commentsInfo]).then(
    ([articles, commentsInfo]) => {
      articles.forEach((article) => {
        let articleCommentCount = commentsInfo.rows.find((comment) => {
          return comment.article_id === article.article_id;
        });

        article.comment_count = parseInt(
          articleCommentCount.number_of_comments
        );
      });
      return articles;
    }
  );
};
exports.fetchArticleData = async (id) => {
  const article = await db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
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
exports.fetchUpdatedVotes = (id, votes) => {
  if (isNaN(votes)) {
    return Promise.reject({
      status: 400,
      msg: "malformed body/missing required fields",
    });
  }
  return db
    .query(
      `
  UPDATE articles
  SET
  votes = votes + ${votes}
  WHERE article_id = ${id}
  RETURNING *;`
    )
    .then(({ rows }) => {
      return { article: rows[0] };
    });
};
