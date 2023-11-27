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
  const { myUserName } = req.body;
  try {
    if (myUserName) {
      const userDetail = await User.find({ username: myUserName });
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

const setUserData = async (req, res) => {
  if (req.body) {
    const {
      myUserName,
      newFullName,
      newEmail,
      newPhone,
      oldPassword,
      newPassword,
    } = req.body;
    try {
      const currentUser = await User.findOne({ username: myUserName });
      if (currentUser) {
        if (newFullName) {
          currentUser.fullname = newFullName;
          await currentUser.save();
          res.json({ status: "ok" });
        }
        if (newEmail) {
          currentUser.email = newEmail;
          await currentUser.save();
          res.json({ status: "ok" });
        }
        if (newPhone) {
          currentUser.phone = newPhone;
          await currentUser.save();
          res.json({ status: "ok" });
        }
        if (oldPassword && newPassword) {
          if (oldPassword === currentUser.password) {
            currentUser.password = newPassword;
            await currentUser.save();
            res.json({ status: "ok" });
          } else {
            res.json("Incorrect password");
          }
          console.log(oldPassword + newPassword);
        }
      }
    } catch (error) {
      res.json("error");
    }
  }
};

const deleteAccount = async (req, res) => {
  if (req.body) {
    const { myUserName, confirmText } = req.body;
    if (myUserName && confirmText) {
      try {
        const currentUser = await User.findOne({ username: myUserName });
        if (confirmText === "CONFIRM") {
          const _id = currentUser._id;
          const deleteAccount = await User.findOneAndDelete(_id);
          if (deleteAccount) {
            res.json("account deleted");
          } else {
            res.json("not deleted");
          }
        } else {
          res.json(`Type "CONFIRM" to proceed`);
        }
      } catch (error) {}
    }
  }
};

module.exports = {
  fetchUsers,
  getUserData,
  getReceiverData,
  setUserData,
  deleteAccount,
};
