import React from "react";
import "../style/Inbox.css";
import { StateContext } from "../context/StateContext";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function Inbox() {
  const { receiverName, myUserName } = React.useContext(StateContext);
  const [message, setMessage] = React.useState("");
  const [chatSent, setChatSent] = React.useState([]);
  const [chatReceived, setChatReceived] = React.useState([]);
  const [trigger, setTrigger] = React.useState(0);
  const messagesEndRef = React.useRef(null);
  const [receiverDetail, setReceiverDetail] = React.useState({});
  const [msgFromSocketBeep, setMsgFromSocketBeep] = React.useState([]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chatReceived]);

  React.useEffect(() => {
    if (msgFromSocketBeep.length > 0) {
      new Audio("/sound/msg-receive.mp3").play();
    }
  }, [chatReceived.length]);

  socket.emit("username", myUserName);

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
    async function getData() {
      await axios
        .post("http://localhost:3000/api/getreceiverdata", { receiverName })
        .then((res) => {
          if (res.data) {
            setReceiverDetail(res.data);
          }
        });
    }
    if (receiverName) {
      fetchChats();
      getData();
    }
  }, [receiverName]);

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data) {
        const _receive = [];
        _receive.push(data);
        setMsgFromSocketBeep(_receive);
      }
      setTrigger((prevCount) => prevCount + 1);
    });
  }, [socket]);

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
  }, [trigger]);

  const combinedChat = [...chatSent, ...chatReceived];
  combinedChat.sort((a, b) => a.timeStamp - b.timeStamp);
  const renderArray = combinedChat.map((chat, index) => {
    const className = chatSent.includes(chat)
      ? "root-right-send-inbox"
      : "root-left-recieve-inbox";

    return (
      <p key={index} className={className}>
        {chat.message}
      </p>
    );
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };
  const handleClick = async () => {
    if (message !== "") {
      await axios.post("http://localhost:3000/api/pushchat", {
        myUserName,
        receiverName,
        message,
      });
      socket.emit("send_message", message);
      new Audio("/sound/msg-sent.mp3").play();
      setMessage("");
    }
  };

  return (
    <>
      <div className="inbox-root-container">
        {Object.keys(receiverDetail).length !== 0 && (
          <div className="dp-name-container">
            <img className="receiver-dp" src={receiverDetail.dp} alt="" />
            <h2>{receiverDetail.fullname}</h2>
          </div>
        )}
        <div className="inbox-displaychat-container">
          {receiverName === null && (
            <div className="root-container-clickuser">Click user to chat</div>
          )}
          {receiverName !== null && (
            <>
              <div className="inbox-rows">
                {renderArray}
                <div ref={messagesEndRef}></div>
              </div>
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
            onKeyDown={handleKeyPressed}
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
