module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI:

    process.env.API_MONGO_URI ||
    "mongodb+srv://admin:oyeY8jI9IHMkzoWf@ldcluster.jntzvmk.mongodb.net/test",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "BD2B1AAF7EF4F09BE9F52CE2D8D599674D81AA9D6A4421696DC4D93DD0619D682CE56B4D64A9EF097761CED99E0F67265B5F76085E5B0EE7CA4696B2AD6FE2B2",
  SALT: process.env.SALT || 10,
  DB_NAME: process.env.DB_NAME || "LDDB",
};
