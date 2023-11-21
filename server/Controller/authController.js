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
    //     Ronaldo: [
    //       { message: "hello", timeStamp: 1 },
    //       { message: "k cha?", timeStamp: 3 },
    //       { message: "kata chau?", timeStamp: 5 },
    //       { message: "Ae ae", timeStamp: 6 },
    //       { message: "k gardai chau?", timeStamp: 7 },
    //       { message: "kata chau?", timeStamp: 11 },
    //       { message: "Ae ae", timeStamp: 12 },
    //       { message: "k gardai chau?", timeStamp: 13 },
    //       { message: "kata chau?", timeStamp: 14 },
    //       { message: "Ae ae", timeStamp: 15 },
    //       { message: "k gardai chau?", timeStamp: 16 },
    //     ],
    //   },
    //   {
    //     Bob: [
    //       { message: "hello", timeStamp: 1 },
    //       { message: "k cha?", timeStamp: 3 },
    //       { message: "kata chau?", timeStamp: 5 },
    //       { message: "Ae ae", timeStamp: 6 },
    //       { message: "k gardai chau?", timeStamp: 7 },
    //       { message: "kata chau?", timeStamp: 11 },
    //       { message: "Ae ae", timeStamp: 12 },
    //       { message: "k gardai chau?", timeStamp: 13 },
    //       { message: "kata chau?", timeStamp: 14 },
    //       { message: "Ae ae", timeStamp: 15 },
    //       { message: "k gardai chau?", timeStamp: 16 },
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
