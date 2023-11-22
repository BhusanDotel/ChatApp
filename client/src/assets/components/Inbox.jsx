import React from "react";
import "../style/Inbox.css";
import { StateContext } from "../context/StateContext";
import { users } from "../Data/Users";
import axios from "axios";

function Inbox() {
  const { receiverName, myUserName } = React.useContext(StateContext);
  const [message, setMessage] = React.useState("");
  const [chatSent, setChatSent] = React.useState([]);
  const [chatReceived, setChatReceived] = React.useState([]);

  React.useEffect(() => {
    // console.log("sender: " + myUserName);
    // console.log("Reciever: " + receiverName);
    users.forEach((item) => {
      if (item.username === myUserName) {
        const chats = item.chats;
        chats.forEach((item) => {
          if (item[receiverName] !== undefined) {
            setChatSent(item[receiverName]);
          }
        });
      }
      if (item.username === receiverName) {
        const chats = item.chats;
        chats.forEach((item) => {
          if (item[myUserName] !== undefined) {
            setChatReceived(item[myUserName]);
          }
        });
      }
    });
  }, []);

  function getLastTimeStamp() {
    let lastSentTimeStamp = 0;
    let lastReceivedTimeStamp = 0;
    const chatSentLength = chatSent.length;
    if (chatSent[chatSentLength - 1] !== undefined) {
      lastSentTimeStamp = chatSent[chatSentLength - 1].timeStamp;
    }

    const chatRecieveLength = chatReceived.length;
    if (chatReceived[chatRecieveLength - 1] !== undefined) {
      lastReceivedTimeStamp = chatReceived[chatRecieveLength - 1].timeStamp;
    }

    if (lastSentTimeStamp > lastReceivedTimeStamp) {
      return lastSentTimeStamp;
    } else {
      return lastReceivedTimeStamp;
    }
  }

  const combinedChat = [...chatSent, ...chatReceived];
  combinedChat.sort((a, b) => a.timeStamp - b.timeStamp);
  const renderArray = combinedChat.map((chat, index) => {
    const className = chatSent.includes(chat)
      ? "root-right-recieve-inbox"
      : "root-left-send-inbox";

    return (
      <div key={index} className={className}>
        {chat.message}
      </div>
    );
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    if (message !== "") {
      let newChat = true;
      users.forEach((item) => {
        if (item.username === myUserName) {
          const chats = item.chats;
          chats.forEach((item) => {
            if (item[receiverName] !== undefined) {
              const chat = item[receiverName];
              chat.push({
                message: message,
                timeStamp: getLastTimeStamp() + 1,
              });
              newChat = false;
            }
          });
          if (newChat) {
            const newMessages = [];
            newMessages.push({
              message: message,
              timeStamp: getLastTimeStamp() + 1,
            });
            const newChat = { [receiverName]: newMessages };
            chats.push(newChat);
          }
        }
      });
    }
  };

  return (
    <>
      <div className="inbox-root-container">
        <div className="inbox-displaychat-container">
          {receiverName === null && (
            <div className="root-container-clickuser">Click user to chat</div>
          )}
          {receiverName !== null && (
            <>
              <div className="inbox-rows">{renderArray}</div>
            </>
          )}
        </div>
        <div className="inbox-inputchat-container">
          <input
            className="inbox-message-input"
            type="text"
            placeholder="Message"
            onChange={handleChange}
            name="message"
            value={message}
          />
          <div onClick={handleClick} className="inbox-send-message">
            send
          </div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
