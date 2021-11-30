const articlesRouter = require("express").Router();
const {
  getArticleByID,
  patchArticleByID,
} = require("../controllers/controller");

articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.patch("/:article_id", patchArticleByID);

module.exports = articlesRouter;
