/* A module that allows you to use the `require` function in the browser. */
require("sexy-require");
/* Importing the cors module. */
var cors = require("cors");
/* A security module that helps protect your app from some well-known web vulnerabilities by setting
HTTP headers appropriately. */
const helmet = require("helmet");
/* A middleware that logs all requests to the console. */
var morgan = require("morgan");
/* Importing the express module. */
var express = require("express");
/* A middleware that handles 404 errors. */
const createHttpError = require("http-errors");
/* A middleware that protects your app from cross-site request forgery attacks. */
var csurf = require("csurf");
/* Importing the database connection function. */
var connect = require("$db/db.setup");
/* Importing the app configuration settings */
const config = require("$config/appconfig");

/* ROUTES */
var authRouter = require("$routes/auth.router");

/* Connecting to the database. */
connect();

/* Creating an instance of the express module. */
var app = express();

/* A middleware that protects your app from cross-site request forgery attacks. */
// app.use(csurf());

/* Allowing the server to accept requests from other domains. */
app.use(cors());

/* A security module that helps protect your app from some well-known web vulnerabilities by setting
HTTP headers appropriately. */
app.use(helmet());

/*logs all requests to the console. */
app.use(morgan("dev"));

/* A middleware that parses the body of the request and makes it available in the `req.body` property. */
app.use(express.json());

/* SERVING ROUTES */
/* Serving the media folder as a static folder. */
// app.use("/media", express.static("../public/images"));
/* Serving auth/ services */
app.use("/auth", authRouter);

// /* A middleware that handles 404 errors. */
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// /* A middleware that handles 404 errors. */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.json({
    status: err.status || 500,
    error: err,
  });
});

app.listen(config.PORT, () => {
  console.log(
    `🚀 ~ Silence is golden, the server is running on port : ${config.PORT}`
  );
});

module.exports = app;
