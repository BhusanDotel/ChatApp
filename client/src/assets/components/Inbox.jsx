import React from "react";
import "../style/Inbox.css";
import { StateContext } from "../context/StateContext";
import axios from "axios";

function Inbox() {
  const { receiverName, myUserName } = React.useContext(StateContext);
  const [message, setMessage] = React.useState("");
  const [chatSent, setChatSent] = React.useState([]);
  const [chatReceived, setChatReceived] = React.useState([]);

  React.useEffect(() => {
    async function fetchChats() {
      await axios
        .post("http://localhost:3000/api/fetchchat", {
          receiverName,
          myUserName,
        })
        .then((res) => {
          if (res.data) {
            if (res.data.chatSent !== undefined) {
              setChatSent(res.data.chatSent);
            }
            if (res.data.chatReceive !== undefined) {
              setChatReceived(res.data.chatReceive);
            }
          }
        });
    }
    fetchChats();
  }, [receiverName]);

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
      await axios.post("http://localhost:3000/api/pushchat", {
        myUserName,
        receiverName,
        message,
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
