const db = require("../db/connection");
const format = require("pg-format");
const fs = require("fs").promises;

exports.getTopicsData = () => {
  return db.query(`SELECT * FROM topics `).then((topics) => {
    return topics.rows;
  });
};
exports.fetchAllArticles = async (sort_by, order_by, sortTopic) => {
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

  let queryStr = "";
  if (typeof sortTopic === "undefined") {
    queryStr = `SELECT * FROM articles ORDER BY ${sort_by} ${order_by};`;
  } else {
    queryStr = `SELECT * FROM articles WHERE topic = '${sortTopic}' ORDER BY ${sort_by} ${order_by};`;
  }

  const articles = db.query(queryStr).then((articles) => {
    return articles.rows;
  });
  const commentsInfo = db.query(`
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
exports.fetchArticleData = (id) => {
  const article = db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
  const commentsInfo = db.query(`
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
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
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
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      }
      return { article: rows[0] };
    });
};
exports.fetchCommentsByID = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No comments found" });
      }
      return rows;
    });
};
exports.postNewCommentByID = (article_id, comment) => {
  const { body, username } = comment;
  const queryStr = format(
    `
  INSERT INTO comments
  (body,author,article_id)
  VALUES
  %L
  RETURNING *;`,
    [[body, username, article_id]]
  );
  return db.query(queryStr).then(({ rows }) => {
    return rows[0];
  });
};
exports.deleteComment = (comment_id) => {
  return db.query(
    `
  DELETE FROM comments WHERE comment_id = $1;`,
    [comment_id]
  );
};
exports.getEndpointsData = () => {
  return fs.readFile("./endpoints.json", "utf8").then((data) => {
    return JSON.parse(data);
  });
};
exports.getUserData = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};
exports.fetchSingleUser = (user) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [user])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows;
    });
};
