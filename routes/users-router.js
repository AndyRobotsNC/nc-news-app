const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/controller");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
