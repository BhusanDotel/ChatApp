const express = require("express");
const router = express.Router();
const chatController = require("../Controller/chatController");

router.post("/fetchChat", chatController.fetchChat);
router.post("/pushChat", chatController.pushChat);
router.post("/fetchlastmessage", chatController.fetchLastMessages);
router.post("/fetchdp", chatController.fetchDp);
module.exports = router;
