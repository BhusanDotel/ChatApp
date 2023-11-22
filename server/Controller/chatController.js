const User = require("../Model/userModel");

let lastTimeStamp = 0;
const fetchChat = async (req, res) => {
  const { myUserName, receiverName } = req.body;
  const responseChatObj = { chatSent: [], chatReceive: [] };
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
        responseChatObj.chatReceive = chats[myUserName];
      }
    });

    res.json(responseChatObj);

    // logic for chat timeStamp for chat orders
    const { chatSent, chatReceive } = responseChatObj;
    let lastSentTimeStamp = 0;
    let lastReceivedTimeStamp = 0;
    const chatSentLength = chatSent.length;
    if (chatSent[chatSentLength - 1] !== undefined) {
      lastSentTimeStamp = chatSent[chatSentLength - 1].timeStamp;
    }

    const chatReceiveLength = chatReceive.length;
    if (chatReceive[chatReceiveLength - 1] !== undefined) {
      lastReceivedTimeStamp = chatReceive[chatReceiveLength - 1].timeStamp;
    }

    if (lastSentTimeStamp > lastReceivedTimeStamp) {
      lastTimeStamp = lastSentTimeStamp + 1;
    } else {
      lastTimeStamp = lastReceivedTimeStamp + 1;
    }
  }
};

const pushChat = async (req, res) => {
  if (req.body) {
    try {
      const { myUserName, receiverName, message } = req.body;
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
