const usersRouter = require("express").Router();
const { getUsers, getUserInfo } = require("../controllers/controller");

usersRouter.get("/", getUsers);
usersRouter.get("/:user", getUserInfo);

module.exports = usersRouter;
