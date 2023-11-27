import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import "../style/Users.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function Users() {
  const { setReceiverName, myUserName } = React.useContext(StateContext);
  const [users, setUsers] = React.useState([]);
  const [activeUsers, setActiveUsers] = React.useState([]);
  const [myDp, setMyDp] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/fetchusers",
          { myUserName }
        );
        if (response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, []);

  React.useEffect(() => {
    const userName = myUserName;
    async function getData() {
      await axios
        .post("http://localhost:3000/api/getuserdata", { userName })
        .then((res) => {
          if (res.data) {
            setMyDp(res.data.dp);
          }
        });
    }
    getData();
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

  const handleLogout = () => {
    localStorage.clear();
    location.reload();
  };

  const userRenderArray = users.map((user, index) => {
    return (
      <div
        className="user-container"
        key={index}
        onClick={() => {
          handleClick(user.username);
        }}
      >
        <div className="image-username-container">
          <img className="user-dp" src={user.dp} alt="" />
          <div className="user-username"> {user.username}</div>
        </div>
        {activeUsers.includes(user.username) && (
          <div className="user-active-status"></div>
        )}
      </div>
    );
  });

  const handleClick = (username) => {
    localStorage.setItem("receiver", username);
    setReceiverName(localStorage.getItem("receiver"));
  };
  const navigateProfile = () => {
    navigate(`/${myUserName}`);
  };
  return (
    <div className="user-profile-root-container">
      <div className="user-root-container">{userRenderArray}</div>
      <div className="profile-container">
        <img
          onClick={navigateProfile}
          className="my-profile-dp"
          src={myDp}
          alt=""
        />
        <p onClick={handleLogout} className="logout-text">
          Logout
        </p>
      </div>
    </div>
  );
}

export default Users;
