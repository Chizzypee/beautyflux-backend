const cloudinary = require("cloudinary").v2; 
require("dotenv").config()

cloudinary.config({
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.CLOUD_KEY,
    API_SECRET: process.env.CLOUD_KEY_SECRET
});

module.exports = {cloudinary};