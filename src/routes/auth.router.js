/* Importing the express module. */
var express = require("express");
/* Creating a router object. */
var router = express.Router();
/* Importing the bcryptjs module. */
const bcrypt = require("bcryptjs");
/* Importing the jsonwebtoken module. */
const jwt = require("jsonwebtoken");
/* Importing the app config */
const config = require("$config/appconfig");
/* Importing auth middleware */
const auth_middleware = require("$middlewares/auth.middleware");
/* Importing the user model. */
const usersCollection = require("$db/db.model.user");

/*
 *Get user input.
 *Validate user input.
 *Validate if the user already exists.
 *Encrypt the user password.
 *Create a user in our database.
 *And finally, create a signed JWT token.
 */
router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "Missing required fields",
      });
    }
    // check if user already exist
    const userExist = await usersCollection.find({
      email: email,
    });

    if (userExist.length > 0) {
      return res.status(409).json({
        message: "User already exist",
        error: "User already exist",
      });
    }

    //Encrypt user password
    const random_salt = config.SALT;
    encryptedPassword = await bcrypt.hash(password, random_salt);

    const new_user_payload = await usersCollection.create({
      first_name,
      last_name,
      phone,
      email,
      password: encryptedPassword,
    });

    // create token for user
    const token = jwt.sign(
      {
        uid: new_user_payload._id,
        email: new_user_payload.email,
      },
      config.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    new_user_payload.token = token;

    return res.status(201).json({
      message: "User created successfully",
      data: {
        first_name: new_user_payload.first_name,
        last_name: new_user_payload.last_name,
        email: new_user_payload.email,
        phone: new_user_payload.phone,
        token: new_user_payload.token,
        createdAt: new_user_payload.createdAt,
        updatedAt: new_user_payload.updatedAt,
      },
    });
  } catch (err) {
    console.log("🚀 ~ file: authRouter.js ~ line 75 ~ router.post ~ err", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

/*
 * Get user input.
 *Validate user input.
 *Validate if the user exists.
 *Verify user password against the password we saved earlier in our database.
 *And finally, create a signed JWT token.
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "Missing required fields",
      });
    }

    const userExist = await usersCollection.findOne({
      email: email,
    });

    if (userExist && (await bcrypt.compare(password, userExist.password))) {
      const token = jwt.sign(
        {
          uid: userExist._id,
          email: userExist.email,
        },
        config.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      userExist.token = token;

      return res.status(200).json({
        message: "User logged in successfully",
        data: {
          first_name: userExist.first_name,
          last_name: userExist.last_name,
          email: userExist.email,
          phone: userExist.phone,
          token: userExist.token,
          createdAt: userExist.createdAt,
          updatedAt: userExist.updatedAt,
        },
      });
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials",
      });
    }
  } catch (err) {
    console.log("🚀 ~ file: authRouter.js ~ line 93 ~ router.post ~ err", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

/* A route that is used to refresh the token. */
router.post("/refresh", auth_middleware, async (req, res, next) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "Missing required fields",
      });
    }

    const userExist = await usersCollection.findOne({
      email: email,
    });

    if (userExist) {
      const token = jwt.sign(
        {
          uid: userExist._id,
          email: userExist.email,
        },
        config.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      userExist.token = token;

      return res.status(200).json({
        message: "Your token has been refreshed",
        data: {
          first_name: userExist.first_name,
          last_name: userExist.last_name,
          email: userExist.email,
          phone: userExist.phone,
          token: userExist.token,
          createdAt: userExist.createdAt,
          updatedAt: userExist.updatedAt,
        },
      });
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials",
      });
    }
  } catch (err) {
    console.log("🚀 ~ file: authRouter.js ~ line 101 ~ router.post ~ err", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

module.exports = router;
