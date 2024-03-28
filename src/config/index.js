require("dotenv").config()
exports.config = {
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    DB_URL: process.env.DB_URL
}