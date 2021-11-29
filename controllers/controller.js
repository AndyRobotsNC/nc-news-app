const { getTopicsData } = require("../models/models");

exports.getTopics = (req, res) => {
  getTopicsData().then((topics) => {
    res.status(200).send(topics);
  });
};
