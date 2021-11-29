const { getTopicsData } = require("../models/models");

exports.getTopics = (req, res, next) => {
  getTopicsData()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};