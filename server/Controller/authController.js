const User = require("../Model/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const userDemo = {
    username: "",
    email: "",
    password: "",
    otp: "",
    isVerified: false,
    dp: "",
    // chats: [
    //   {
    //     j5s44f6a5sd: [
    //       {
    //         message: "",
    //         time: "",
    //       },
    //       {
    //         message: "",
    //         time: "",
    //       },
    //     ],
    //   },
    //   {
    //     s5d4as54d6a: [
    //       {
    //         message: "",
    //         time: "",
    //       },
    //       {
    //         message: "",
    //         time: "",
    //       },
    //     ],
    //   },
    // ],
  };
  if (req.body) {
    const { username, email, password } = req.body;
    if (username !== "" && email !== "" && password !== "") {
      try {
        userDemo.username = username;
        userDemo.email = email;
        userDemo.password = password;
        const user = new User({
          user: userDemo,
        });
        await user.save();
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
    const usernameExists = await User.findOne({ "user.username": username });
    if (usernameExists) {
      if (usernameExists.user.password === password) {
        const uId = {
          id: usernameExists._id,
        };
        const userToken = jwt.sign(uId, secretKey);
        return res.json({ userToken: userToken });
      } else {
        res.json("Username and password not matched");
      }
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  register,
  login,
};
