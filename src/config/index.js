require("dotenv").config()
exports.config = {
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    DB_URL: process.env.DB_URL,
    CLOUD_KEY: process.env.CLOUD_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_KEY_SECRET: process.env.CLOUD_KEY_SECRET,
}