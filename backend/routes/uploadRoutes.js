const express = require("express");
const router = express.Router();
const { upload, uploadToCloudinary } = require("../config/cloudinary");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// =======================
// THUMBNAIL UPLOAD
// =======================
router.post(
  "/thumbnail",
  protect,
  adminOnly,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }
      const result = await uploadToCloudinary(
        req.file.path,
        "streamvibe/thumbnails"
      );
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed!" });
    }
  }
);

// =======================
// VIDEO UPLOAD
// =======================
router.post(
  "/video",
  protect,
  adminOnly,
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }
      const result = await uploadToCloudinary(
        req.file.path,
        "streamvibe/videos",
        "video"
      );
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed!" });
    }
  }
);

// =======================
// CAST PHOTO UPLOAD
// =======================
router.post(
  "/cast-photo",
  protect,
  adminOnly,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }
      const result = await uploadToCloudinary(
        req.file.path,
        "streamvibe/cast"
      );
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Cast photo upload failed!" });
    }
  }
);

module.exports = router;