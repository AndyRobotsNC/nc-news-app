const { getTopicsData, fetchArticleData } = require("../models/models");

exports.getTopics = (req, res, next) => {
  getTopicsData()
    .then((topics) => {
      res.status(200).send({ topics: topics });
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
