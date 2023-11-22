const User = require("../Model/userModel");

const fetchChat = async (req, res) => {
  const { myUserName, receiverName } = req.body;
  const responseChatObj = { chatSent: [], chatRecieve: [] };
  if (myUserName && receiverName) {
    const sendingUser = await User.findOne({ username: myUserName });
    const sChats = sendingUser.chats;
    sChats.forEach((chats) => {
      if (chats[receiverName] !== undefined) {
        responseChatObj.chatSent = chats[receiverName];
      }
    });

    const receivingUser = await User.findOne({ username: receiverName });
    const rChats = receivingUser.chats;
    rChats.forEach((chats) => {
      if (chats[myUserName] !== undefined) {
        responseChatObj.chatRecieve = chats[myUserName];
      }
    });

    res.json(responseChatObj);
  }
};

const pushChat = async (req, res) => {
  if (req.body) {
    try {
      const { myUserName, receiverName, message, lastTimeStamp } = req.body;
      const users = await User.findOne({ username: myUserName });

      let newChat = true;
      const chats = users.chats;
      chats.forEach((msgChunks) => {
        if (msgChunks[receiverName] !== undefined) {
          const chatObjArray = msgChunks[receiverName];
          const newChatObj = { message: message, timeStamp: lastTimeStamp };
          chatObjArray.push(newChatObj);
          newChat = false;
        }
      });
      if (newChat) {
        const newChatObj = { message: message, timeStamp: lastTimeStamp };
        const chatObjArray = [];
        chatObjArray.push(newChatObj);
        const msgChunk = { [receiverName]: chatObjArray };
        chats.push(msgChunk);
      }
      users.markModified("chats");
      await users.save();
      console.log("Chat saved");
      res.json("chat updated");
    } catch (error) {
      res.json(error);
    }
  }
};

module.exports = {
  fetchChat,
  pushChat,
};
