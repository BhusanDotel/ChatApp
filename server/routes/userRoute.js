const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/fetchuser", userController.fetchUser);
module.exports = router;
