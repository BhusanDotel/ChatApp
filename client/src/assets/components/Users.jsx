import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import { host } from "../Utils/ApiRoutes";
import { fetchLastMessageApi } from "../Utils/ApiRoutes";
import { fetchUsersApi } from "../Utils/ApiRoutes";
import { getUserDataApi } from "../Utils/ApiRoutes";
import "../style/Users.css";
import io from "socket.io-client";

const socket = io.connect(host);

function Users() {
  const { setReceiverName, myUserName } = React.useContext(StateContext);
  const [users, setUsers] = React.useState([]);
  const [activeUsers, setActiveUsers] = React.useState([]);
  const [myDp, setMyDp] = React.useState("");
  const [lastReceiveMessages, setLastReceiveMessages] = React.useState("");
  const [trigger, setTrigger] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      setTrigger((prevCount) => prevCount + 1);
    });
  }, [socket]);

  React.useEffect(() => {
    async function fetchChats() {
      await axios
        .post(fetchLastMessageApi, {
          myUserName,
        })
        .then((res) => {
          if (res.data !== "something went wrong") {
            const _data = res.data;
            const parsedArray = _data.map((jsonString) =>
              JSON.parse(jsonString)
            );
            setLastReceiveMessages(parsedArray);
          }
        });
    }
    fetchChats();
  }, [trigger]);

  React.useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.post(fetchUsersApi, { myUserName });
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
    async function getData() {
      await axios.post(getUserDataApi, { myUserName }).then((res) => {
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
  const Profile = () => {
    navigate("/profile");
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
        <div className="user-info-container">
          <div className="image-username-container">
            <img className="user-dp" src={user.dp} alt="" />
            <div className="user-username"> {user.username}</div>
          </div>
          {activeUsers.includes(user.username) && (
            <div className="user-active-status"></div>
          )}
        </div>
        <div className="last-message-div">
          {lastReceiveMessages.map((lastMsgObj, index) => {
            if (lastMsgObj[user.username]) {
              return (
                <p className="lastmessage-text" key={index}>
                  {lastMsgObj[user.username]}
                </p>
              );
            }
          })}
        </div>
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
        <p onClick={Profile} className="profile-text">
          Profile
        </p>
      </div>
    </div>
  );
}

export default Users;
