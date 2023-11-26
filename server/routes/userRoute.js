const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");

router.post(
  "/register",
  authController.uploadMiddleware,
  authController.register
);
router.post("/login", authController.login);
router.post("/fetchusers", userController.fetchUsers);
router.post("/getuserdata", userController.getUserData);
router.post("/getreceiverdata", userController.getReceiverData);
module.exports = router;
