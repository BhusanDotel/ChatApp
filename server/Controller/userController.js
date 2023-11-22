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

module.exports = {
  fetchUser,
};
