const commentsRouter = require("express").Router();
const { deleteCommentByID } = require("../controllers/controller");

commentsRouter.delete("/:comment_id", deleteCommentByID);

module.exports = commentsRouter;
