const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleByID,
  patchArticleByID,
  getCommentsByID,
  postCommentByID,
} = require("../controllers/controller");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.get("/:article_id/comments", getCommentsByID);

articlesRouter.patch("/:article_id", patchArticleByID);

articlesRouter.post("/:article_id/comments", postCommentByID);

module.exports = articlesRouter;
