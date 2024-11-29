const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadBeat,
  getAllBeats,
  getBeatById,
  updateBeat,
  deleteBeat,
} = require("../controllers/beatController");

// Configure Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = file.mimetype.startsWith("audio")
        ? "uploads/audio"
        : "uploads/images";
      cb(null, folder);
    },
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  }),
  fileFilter: (req, file, cb) => {
    const isValid =
      file.mimetype.startsWith("audio") || file.mimetype.startsWith("image");
    isValid ? cb(null, true) : cb(new Error("Invalid file type"), false);
  },
});

// Routes
router.post(
  "/upload",
  upload.fields([{ name: "audioFile" }, { name: "image" }]),
  uploadBeat
);
router.get("/", getAllBeats);
router.get("/:id", getBeatById);
router.put("/:id", updateBeat);
router.delete("/:id", deleteBeat);

module.exports = router;
