const mongoose = require("mongoose");

/* Creating a schema for the user model. */
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    phone: { type: String, default: null },
    password: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);

userModel = mongoose.model("users", userSchema);

module.exports = userModel;
