const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleByID,
  patchArticleByID,
} = require("../controllers/controller");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.patch("/:article_id", patchArticleByID);

module.exports = articlesRouter;
