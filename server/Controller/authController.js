const User = require("../Model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;

const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.single("image");

const register = async (req, res) => {
  const { fullname, username, email, phone, password, gender } = req.body;
  const usernameExists = await User.findOne({ username: username });
  if (usernameExists) {
    res.json("UserName already Taken");
  } else {
    if (req.file) {
      if (fullname && username && email && phone && password && gender) {
        try {
          const _public_id = fullname + password;
          const up_img = await cloudinary.uploader.upload(req.file.path, {
            public_id: _public_id,
          });
          const userDp = up_img.secure_url;

          // this will delete image from localstorage
          if (userDp) {
            fs.unlinkSync(req.file.path);
          }

          User.create({
            fullname: fullname,
            username: username,
            email: email,
            phone: phone,
            password: password,
            gender: gender,
            otp: "",
            isVerified: false,
            dp: userDp,
            ip: "",
            city: "",
            longitude: "",
            latitude: "",
            isp: "",
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
            fullname: fullname,
            username: username,
            email: email,
            phone: phone,
            password: password,
            gender: gender,
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
        const USER_DATA_KEY = process.env.USER_DATA_KEY;
        try {
          await axios
            .get(`https://api.ipdata.co/?api-key=${USER_DATA_KEY}`)
            .then(async (res) => {
              const data = res.data;
              usernameExists.ip = data.ip;
              usernameExists.city = data.city;
              usernameExists.longitude = data.longitude;
              usernameExists.latitude = data.latitude;
              usernameExists.isp = data.asn.name;
              await usernameExists.save();
            });
        } catch (error) {}

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
  uploadMiddleware,
  login,
};
