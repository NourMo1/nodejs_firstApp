const express = require("express");
const multer = require("multer");
const errorHandler = require("../utils/errorHandler");
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const router = express.Router();

// Multer Configuration
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1]; 
    const fileName = `avatar-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = function (req, file, cb) {
  const imageType = file.mimetype.split("/")[0]; 
  if (imageType === "image") {
    cb(null, true);
  } else {
    cb(errorHandler.create("Only image files are allowed!", 400), false);
  }
}

const upload = multer({ storage: diskStorage, fileFilter });

// Routes
router.route("/").get(verifyToken, allowedTo('admin'), usersController.getAllUsers);
router.route("/login").post(usersController.login);
router.route("/register").post( upload.single('avatar'), usersController.register);

module.exports = router;