const cloudinary = require("cloudinary").v2; 
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET,
    secure: true,
});

const assets = {
    Upload_presets: "beautyflux",
    Folder: "bflux_cloudinay"
}

module.exports = {
    cloudinary,
    assets
};