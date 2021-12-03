const express = require("express");
const apiRouter = require("./routes/api-router");
const app = express();
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const { getEndpoints } = require("./controllers/controller");

app.use(express.json());

app.use("/api", apiRouter);
app.get("/api", getEndpoints);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
