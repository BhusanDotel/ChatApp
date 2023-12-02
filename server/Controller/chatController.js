const { json } = require("body-parser");
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

const fetchLastMessages = async (req, res) => {
  const lastMessages = [];
  const { myUserName } = req.body;
  try {
    if (myUserName) {
      // this will print all data expcept that has username myUserName
      const allChats = await User.find({
        username: { $ne: myUserName },
      });
      if (allChats) {
        allChats.forEach((item) => {
          const chats = item.chats;
          if (chats.length > 0) {
            chats.forEach((obj) => {
              if (obj[myUserName]) {
                const messages = obj[myUserName];
                messages.forEach((msg) => {
                  const messageWithMaxTimeStamp = messages.reduce(
                    (max, msg) => (msg.timeStamp > max.timeStamp ? msg : max),
                    messages[0]
                  );
                  const lastmessage = {
                    [item.username]: messageWithMaxTimeStamp.message,
                  };
                  const lastmessageString = JSON.stringify(lastmessage);

                  if (!lastMessages.includes(lastmessageString)) {
                    lastMessages.push(lastmessageString);
                  }
                });
              }
            });
          }
        });
      }
      res.json(lastMessages);
    }
  } catch (error) {
    res.json("something went wrong");
  }
};

const fetchDp = async (req, res) => {
  if (req.body) {
    const { myUserName, receiverName } = req.body;
    if (myUserName && receiverName) {
      const dp = {
        senderDp: "",
        receiverDp: "",
      };
      const sender = await User.findOne({ username: myUserName });
      if (sender) {
        dp.senderDp = sender.dp;
      }
      const receiver = await User.findOne({ username: receiverName });
      if (receiver) {
        dp.receiverDp = receiver.dp;
      }
      res.json(dp);
    }
  }
};

module.exports = {
  fetchChat,
  pushChat,
  fetchLastMessages,
  fetchDp,
};
