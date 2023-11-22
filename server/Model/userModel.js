const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  dp: {
    type: String,
    required: false,
  },
  chats: {
    type: Array,
    required: false,
  },
});

const User = mongoose.model("ChatUser", userSchema);

module.exports = User;
