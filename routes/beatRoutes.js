const express = require("express");
const router = express.Router();
const {
  uploadBeat,
  getAllBeats,
  getBeatById,
  updateBeat,
  deleteBeat,
} = require("../controllers/beatController");
const multer = require("multer");
const path = require("path");

// Define storage for audio and image files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/audio"); // Save to "uploads/audio" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename to avoid duplicates
  },
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Save to "uploads/images" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename to avoid duplicates
  },
});

// File filter for audio files (only accept audio formats)
const audioFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only audio files are allowed!"), false);
  }
};

// File filter for images (only accept image formats)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed!"), false);
  }
};

// Set up multer for handling file uploads
const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
});
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});

// Route for uploading a beat
router.post(
  "/upload",
  uploadAudio.single("audioFile"),
  uploadImage.single("image"),
  uploadBeat
);

// Route for getting all beats
router.get("/", getAllBeats);

// Route for getting a single beat by ID
router.get("/:id", getBeatById);

// Route for updating a beat
router.put("/:id", updateBeat);

// Route for deleting a beat
router.delete("/:id", deleteBeat);

module.exports = router;
