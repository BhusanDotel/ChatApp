import React from "react";
import axios from "axios";
import { StateContext } from "../context/StateContext";
import "../style/Users.css";

function Users() {
  const { setReceiverName } = React.useContext(StateContext);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    async function getUsers() {
      const response = await axios.get("http://localhost:3000/api/fetchuser");
      setUsers(response.data);
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
