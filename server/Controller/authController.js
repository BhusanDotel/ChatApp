const User = require("../Model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  if (req.body) {
    const { username, email, password } = req.body;
    if (username !== "" && email !== "" && password !== "") {
      try {
        User.create({
          username: username,
          email: email,
          password: password,
          otp: "",
          isVerified: false,
          dp: "",
          chats: [],
        });
        res.json("Registered Successfully!");
      } catch (error) {
        res.json("Something went wrong!");
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
