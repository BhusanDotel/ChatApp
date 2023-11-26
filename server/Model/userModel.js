const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    requird: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
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
