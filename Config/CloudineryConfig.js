const cloudinary = require('cloudinary').v2;

const cloudinaryConfig = cloudinary.config({
    cloud_name: "uthmancoder",
    api_key: "331917233267244",
    api_secret: "jYxuv8THBooQjFelkHSLcSLCcCI",
})

module.exports = { cloudinaryConfig, cloudinary };