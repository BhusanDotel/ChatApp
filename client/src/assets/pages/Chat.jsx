import React from "react";
import Users from "../components/Users";
import Inbox from "../components/Inbox";
import "../style/Chat.css";

function Chat() {
  return (
    <div className="chat-root-container">
      <Users />
      <Inbox />
    </div>
  );
}

export default Chat;
