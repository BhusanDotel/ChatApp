const User = require("../Model/userModel");

const fetchUsers = async (req, res) => {
  const currentUser = req.body.myUserName;
  if (currentUser) {
    try {
      const users = await User.find();
      const usersArray = [];
      if (users.length > 0) {
        users.forEach((item) => {
          const username = item.username;
          const dp = item.dp;
          if (currentUser !== username) {
            const userDetail = { username: username, dp: dp };
            if (username) {
              usersArray.push(userDetail);
            }
          }
        });
        res.json(usersArray);
      } else {
        res.json("No user found");
      }
    } catch (error) {
      res.json(error);
    }
  }
};

const getUserData = async (req, res) => {
  const { userName } = req.body;
  try {
    if (userName) {
      const userDetail = await User.find({ username: userName });
      if (userDetail) {
        res.json(userDetail[0]);
      } else {
        res.json("Not Found");
      }
    }
  } catch (error) {
    res.json(error);
  }
};

const getReceiverData = async (req, res) => {
  const { receiverName } = req.body;
  try {
    if (receiverName) {
      const userDetail = await User.find({ username: receiverName });
      if (userDetail) {
        res.json(userDetail[0]);
      } else {
        res.json("Not Found");
      }
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  fetchUsers,
  getUserData,
  getReceiverData,
};
