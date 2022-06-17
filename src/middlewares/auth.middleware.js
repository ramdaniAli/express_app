const jwt = require("jsonwebtoken");
const config = require("$config/appconfig");

/**
 * If the token is not present, return a 403 error. If the token is present, verify it and return the
 * decoded token. If the token is invalid, return a 401 error.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 * @returns The next middleware function in the app.js file.
 */
const verifyToken = async (req, res, next) => {
  // users as using Bearer token
  const BearerToken = req.headers["authorization"];
  const bearer = BearerToken && BearerToken.split(" ");
  const bearer_token = bearer[1];
  const token = bearer_token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
