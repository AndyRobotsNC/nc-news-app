const {
  getTopicsData,
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
