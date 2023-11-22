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

    axios
      .post("http://localhost:3000/api/fetchchat", {
        receiverName,
        myUserName,
      })
      .then((res) => {
        console.log(res.data);
      });
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

  const handleClick = async () => {
    if (message !== "") {
      const lastTimeStamp = getLastTimeStamp() + 1;
      await axios.post("http://localhost:3000/api/pushchat", {
        myUserName,
        receiverName,
        message,
        lastTimeStamp,
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
