import React from "react";
import "../style/Inbox.css";
import { StateContext } from "../context/StateContext";
import axios from "axios";

function Inbox() {
  const { receiverName, myUserName } = React.useContext(StateContext);
  const [message, setMessage] = React.useState("");
  const [chatSent, setChatSent] = React.useState([]);
  const [chatReceived, setChatReceived] = React.useState([]);

  // React.useEffect(() => {
  //   async function getData() {
  //     const response = await axios.get("http://localhost:3000/api/chat");
  //     console.log(response.data);
  //   }
  //   getData();
  // });
  const chatSend = [
    { message: "hello", timeStamp: 1 },
    { message: "k cha?", timeStamp: 3 },
    { message: "kata chau?", timeStamp: 5 },
    { message: "Ae ae", timeStamp: 6 },
    { message: "k gardai chau?", timeStamp: 7 },
    { message: "kata chau?", timeStamp: 11 },
    { message: "Ae ae", timeStamp: 12 },
    { message: "k gardai chau?", timeStamp: 13 },
    { message: "kata chau?", timeStamp: 14 },
    { message: "Ae ae", timeStamp: 15 },
    { message: "k gardai chau?", timeStamp: 16 },
  ];
  const chatReceive = [
    { message: "hi", timeStamp: 2 },
    { message: "thi cha?", timeStamp: 4 },
    { message: "ma yetai gharr", timeStamp: 5 },
    { message: "ma yettikai ho yar", timeStamp: 8 },
    { message: "ahni gaun kailey aauney?", timeStamp: 9 },
    { message: "demo", timeStamp: 10 },
  ];

  const combinedChat = [...chatSend, ...chatReceive];
  combinedChat.sort((a, b) => a.timeStamp - b.timeStamp);
  const renderArray = combinedChat.map((chat, index) => {
    const className = chatSend.includes(chat)
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

  return (
    <>
      <div className="inbox-root-container">
        <div className="inbox-displaychat-container">
          {receiverName === "empty" && (
            <div className="root-container-clickuser">Click user to chat</div>
          )}
          {receiverName !== "empty" && (
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
          <div className="inbox-send-message">send</div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
