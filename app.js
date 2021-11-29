const express = require("express");
const apiRouter = require("./routes/api-router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
