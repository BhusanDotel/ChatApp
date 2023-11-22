const express = require("express");
const router = express.Router();
const chatController = require("../Controller/chatController");

router.post("/fetchChat", chatController.fetchChat);
router.post("/pushChat", chatController.pushChat);
module.exports = router;
