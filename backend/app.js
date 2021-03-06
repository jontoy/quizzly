/** Express app for jobly. */

const express = require("express");

const ExpressError = require("./helpers/expressError");

const morgan = require("morgan");

const app = express();

const quizRoutes = require("./routes/quizzes.js");
const questionRoutes = require("./routes/questions");
const optionRoutes = require("./routes/options");

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(morgan("tiny"));

app.use("/quiz", quizRoutes);
app.use("/question", questionRoutes);
app.use("/option", optionRoutes);

app.get("/", (req, res, next) => {
  return res.json({ message: "Welcome to the Quizzly API" });
});

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
