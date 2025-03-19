const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const File = require("../models/File");

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only document files are allowed"), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

//Upload file route
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  try {
    const newFile = new File({
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      studentName: req.body.studentName,
      lecturerName: req.body.lecturerName,
      path: req.file.path,
    });
    
    await newFile.save();
    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get files for student
router.get("/student/:name", authenticate, async (req, res) => {
  try {
    // Ensure user can only access their own files
    if (req.user.name !== req.params.name && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    const files = await File.find({ studentName: req.params.name });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get files for lecturer
router.get("/lecturer/:name", authenticate, async (req, res) => {
  try {
    // Ensure only the lecturer can access their files
    if (req.user.name !== req.params.name && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    const files = await File.find({ lecturerName: req.params.name });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Download file
router.get("/download/:id", authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Check if user has access to this file
    if (
      req.user.name !== file.studentName &&
      req.user.name !== file.lecturerName &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    res.download(file.path, file.originalFilename);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;