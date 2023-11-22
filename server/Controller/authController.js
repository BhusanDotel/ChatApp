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
          chats: [
            // {
            //   Ronaldo: [
            //     { message: "hello", timeStamp: 1 },
            //     { message: "k cha?", timeStamp: 3 },
            //     { message: "kata chau?", timeStamp: 5 },
            //     { message: "Ae ae", timeStamp: 6 },
            //     { message: "k gardai chau?", timeStamp: 7 },
            //     { message: "kata chau?", timeStamp: 11 },
            //     { message: "Ae ae", timeStamp: 12 },
            //     { message: "k gardai chau?", timeStamp: 13 },
            //     { message: "kata chau?", timeStamp: 14 },
            //     { message: "Ae ae", timeStamp: 15 },
            //     { message: "k gardai chau?", timeStamp: 16 },
            //   ],
            // },
          ],
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
