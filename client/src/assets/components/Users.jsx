import React from "react";
import axios from "axios";
import { StateContext } from "../context/StateContext";
import "../style/Users.css";

function Users() {
  const { setReceiverName, myUserName } = React.useContext(StateContext);
  const [users, setUsers] = React.useState([]);

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
      </div>
    );
  });
  const handleClick = (username) => {
    localStorage.setItem("receiver", username);
    setReceiverName(() => {
      return localStorage.getItem("receiver");
    });
  };
  return <div className="user-root-container">{renderArray}</div>;
}

export default Users;
