const mongoose = require("mongoose");
const config = require("$config/appconfig");
/**
 * Connect() is an async function that connects to the database using mongoose.connect() and returns a
 * promise. If the promise is resolved, it logs a success message. If the promise is rejected, it logs
 * an error message and exits the process.
 */
async function connect() {
  await mongoose
    .connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // bufferTimeoutMS: 6000,
      dbName: config.DB_NAME,
      // user
      // pass
      // maxPoolSize: 1000
    })
    .then(() => {
      console.log(
        "🚀 ~ file: db.connect.ts ~ line 13 ~ connect ~ Successfully connected to database !"
      );
    })
    .catch((err) => {
      console.log(
        "💣 ~ file: db.connect.ts ~ line 17 ~ .then ~ err ~ database connection failed. exiting now..."
      );
      console.error(err);
      process.exit(1);
    });
}

module.exports = connect;
