import React from "react";
import "../style/Inbox.css";
import { StateContext } from "../context/StateContext";
import { host } from "../Utils/ApiRoutes";
import { fetchChatApi } from "../Utils/ApiRoutes";
import { getReceiverDataApi } from "../Utils/ApiRoutes";
import { pushChatApi } from "../Utils/ApiRoutes";
import { fetchDpApi } from "../Utils/ApiRoutes";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect(host);

function Inbox() {
  const { receiverName, myUserName } = React.useContext(StateContext);
  const [message, setMessage] = React.useState("");
  const [chatSent, setChatSent] = React.useState([]);
  const [chatReceived, setChatReceived] = React.useState([]);
  const [trigger, setTrigger] = React.useState(0);
  const messagesEndRef = React.useRef(null);
  const [receiverDetail, setReceiverDetail] = React.useState({});
  const [msgFromSocketBeep, setMsgFromSocketBeep] = React.useState([]);
  const [useDp, setUserDp] = React.useState({
    senderDp: "",
    receiverDp: "",
  });
  const [isSending, setSending] = React.useState(false);

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
        .post(fetchChatApi, {
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
      await axios.post(getReceiverDataApi, { receiverName }).then((res) => {
        if (res.data) {
          setReceiverDetail(res.data);
        }
      });
    }
    async function fetchDp() {
      await axios.post(fetchDpApi, { myUserName, receiverName }).then((res) => {
        if (res.data) {
          const _userDp = { ...useDp };
          _userDp.senderDp = res.data.senderDp;
          _userDp.receiverDp = res.data.receiverDp;
          setUserDp(_userDp);
        }
      });
    }
    if (receiverName) {
      fetchChats();
      getData();
      fetchDp();
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
        .post(fetchChatApi, {
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
    const classNameDiv = chatSent.includes(chat)
      ? "root-right-send-inbox"
      : "root-left-recieve-inbox";
    const classNameChat = chatSent.includes(chat)
      ? "chat-right-send-inbox"
      : "chat-left-recieve-inbox";
    const dpFinder = chatSent.includes(chat) ? "senderDp" : "receiverDp";

    return (
      <div key={index} className={classNameDiv}>
        <p className={classNameChat}>{chat.message}</p>
        <div className="image-div">
          <img className="chat-mini-dp" src={useDp[dpFinder]} alt="" />
        </div>
      </div>
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
      setSending(true);
      await axios.post(pushChatApi, {
        myUserName,
        receiverName,
        message,
      });
      socket.emit("send_message", message);
      new Audio("/sound/msg-sent.mp3").play();
      setMessage("");
      setSending(false);
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
            placeholder="Enter Message"
            onChange={handleChange}
            name="message"
            onKeyDown={handleKeyPressed}
            value={message}
          />
          <div onClick={handleClick} className="inbox-send-message">
            {isSending ? "sending...." : "Send"}
          </div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
