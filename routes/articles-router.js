const articlesRouter = require("express").Router();
const { getArticleByID } = require("../controllers/controller");

articlesRouter.get("/:article_id", getArticleByID);

module.exports = articlesRouter;
