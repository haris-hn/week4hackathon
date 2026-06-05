const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer (local temp storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload helper function
const uploadToCloudinary = async (filePath, folder, resourceType = "auto") => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
};