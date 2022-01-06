const {
  getTopicsData,
  fetchAllArticles,
  fetchArticleData,
  fetchUpdatedVotes,
  fetchCommentsByID,
  postNewCommentByID,
  deleteComment,
  getEndpointsData,
  getUserData,
  fetchSingleUser,
} = require("../models/models");

const { checkValidUsername, checkCommentID } = require("../errors/utils");

exports.getTopics = (req, res, next) => {
  getTopicsData()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};
exports.getAllArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const orderBy = req.query.order_by;
  const topic = req.query.topic;
  fetchAllArticles(sortBy, orderBy, topic)
    .then((articles) => {
      if (articles.length === 0) {
        res.status(404).send({ msg: "Topic not found" });
      } else {
        res.status(200).send({ articles: articles });
      }
    })
    .catch(next);
};
exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleData(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
exports.patchArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const updatedVotes = req.body.inc_votes;
  fetchUpdatedVotes(article_id, updatedVotes)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};
exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByID(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};
exports.postCommentByID = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  return checkValidUsername("username", body.username, "users")
    .then(() => {
      return postNewCommentByID(article_id, body);
    })
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;

  return checkCommentID("comment_id", comment_id, "comments")
    .then(() => {
      return deleteComment(comment_id);
    })
    .then((response) => {
      res.status(204).send();
    })
    .catch(next);
};
exports.getEndpoints = (req, res, next) => {
  getEndpointsData().then((data) => {
    res.status(200).send({ endpoints: data });
  });
};
exports.getUsers = (req, res, next) => {
  getUserData()
    .then((data) => {
      res.status(200).send({ users: data });
    })
    .catch(next);
};
exports.getUserInfo = (req, res, next) => {
  const { user } = req.params;
  fetchSingleUser(user)
    .then((data) => {
      res.status(200).send({ user: data });
    })
    .catch(next);
};
