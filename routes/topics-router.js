const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
