const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.Mixed,
});

const User = mongoose.model("ChatUser", userSchema);

module.exports = User;
