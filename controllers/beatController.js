const Beat = require("../models/Beat");
const path = require("path");

// Define storage for audio and image files
const multer = require("multer");

// Define the file storage locations and naming convention
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

exports.uploadBeat = async (req, res) => {
  try {
    const { title, artist, genre, price } = req.body;

    // Make sure files are uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    const beat = new Beat({
      title,
      artist,
      genre,
      price,
      audioFile: req.file.path, // The path to the uploaded audio file
      image: req.file.path, // The path to the uploaded image file
    });

    await beat.save();
    res.status(201).json({ message: "Beat uploaded successfully", beat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBeats = async (req, res) => {
  try {
    const beats = await Beat.find();
    res.status(200).json(beats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beats" });
  }
};

exports.getBeatById = async (req, res) => {
  try {
    const beat = await Beat.findById(req.params.id);
    if (!beat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res.status(200).json(beat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beat" });
  }
};

exports.updateBeat = async (req, res) => {
  try {
    const beat = await Beat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!beat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res.status(200).json({ message: "Beat updated successfully", beat });
  } catch (error) {
    res.status(500).json({ message: "Error updating beat" });
  }
};

exports.deleteBeat = async (req, res) => {
  try {
    const beat = await Beat.findByIdAndDelete(req.params.id);
    if (!beat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res.status(200).json({ message: "Beat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting beat" });
  }
};
