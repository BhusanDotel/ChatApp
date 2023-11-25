const User = require("../Model/userModel");

const fetchUser = async (req, res) => {
  const users = await User.find();
  const usersArray = [];
  if (users.length > 0) {
    users.forEach((item) => {
      const username = item.username;
      usersArray.push(username);
    });
    res.json(usersArray);
  } else {
    res.json("No user found");
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

module.exports = {
  fetchUser,
  getUserData,
};
