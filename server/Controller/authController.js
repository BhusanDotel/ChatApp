const User = require("../Model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (req.file) {
    if (username && email && password) {
      try {
        const up_img = await cloudinary.uploader.upload(req.file.path, {
          public_id: username,
        });
        console.log("image uploaded");
        const userDp = up_img.secure_url;
        User.create({
          username: username,
          email: email,
          password: password,
          otp: "",
          isVerified: false,
          dp: userDp,
          chats: [],
        });
        res.json("Registered Successfully!");
      } catch (error) {
        res.json("something went wrong");
      }
    }
  } else {
    if (username && email && password) {
      try {
        User.create({
          username: username,
          email: email,
          password: password,
          otp: "",
          isVerified: false,
          dp: "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
          chats: [],
        });
        res.json("Registered Successfully!");
      } catch (error) {
        res.json("something went wrong");
      }
    }
  }
};

const secretKey = process.env.SECRET_KEY;
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      if (usernameExists.password === password) {
        const uId = {
          id: usernameExists._id,
        };
        const userToken = jwt.sign(uId, secretKey);
        return res.json({ userToken: userToken });
      } else {
        res.json("Username and password not matched");
      }
    } else if (usernameExists === null) {
      res.json("Can't recognize you");
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  register,
  login,
};
