const {
  getTopicsData,
  fetchAllArticles,
  fetchArticleData,
  fetchUpdatedVotes,
} = require("../models/models");

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
  fetchAllArticles(sortBy, orderBy, topic).then((articles) => {
    if (articles.length === 0) {
      res.status(404).send({ msg: "Topic not found" });
    } else {
      res.status(200).send({ articles: articles });
    }
  });
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
