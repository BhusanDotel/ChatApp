const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");

const upload = multer({ dest: "uploads/" });
router.post("/register", upload.single("image"), authController.register);
router.post("/login", authController.login);
router.get("/fetchuser", userController.fetchUser);
router.post("/getuserdata", userController.getUserData);
module.exports = router;
