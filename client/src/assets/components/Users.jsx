import React from "react";
import axios from "axios";
import { StateContext } from "../context/StateContext";
import "../style/Users.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function Users() {
  const { setReceiverName, myUserName } = React.useContext(StateContext);
  const [users, setUsers] = React.useState([]);
  const [activeUsers, setActiveUsers] = React.useState([]);

  React.useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("http://localhost:3000/api/fetchuser");
        if (response.data) {
          const userArray = [...response.data];
          if (userArray.includes(myUserName)) {
            const myUserNameIndex = userArray.indexOf(myUserName);
            userArray.splice(myUserNameIndex, 1);
            setUsers(userArray);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, []);

  React.useEffect(() => {
    socket.on("activeUsers", (activeUser) => {
      const _activeUser = [];
      activeUser.forEach((item) => {
        _activeUser.push(item.username);
      });
      setActiveUsers(_activeUser);
    });
  }, [socket]);

  const renderArray = users.map((username, index) => {
    return (
      <div
        key={index}
        onClick={() => {
          handleClick(username);
        }}
        className="root-container-users"
      >
        {username}
        {activeUsers.includes(username) && (
          <div className="user-active-status"></div>
        )}
      </div>
    );
  });
  const handleClick = (username) => {
    localStorage.setItem("receiver", username);
    setReceiverName(localStorage.getItem("receiver"));
  };
  return <div className="user-root-container">{renderArray}</div>;
}

export default Users;
