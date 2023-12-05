import React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../Utils/ApiRoutes";

function Login() {
  const [userDetail, setUserDetail] = React.useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleChange = (e) => {
    const _userDetail = { ...userDetail };
    _userDetail[e.target.name] = e.target.value;
    setUserDetail(_userDetail);
  };

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    const { username, password } = userDetail;
    if (username && password) {
      setIsLoading(true);
      await axios
        .post(loginApi, {
          username,
          password,
        })
        .then((res) => {
          if (res.data) {
            if (res.data.userToken) {
              localStorage.setItem("authToken", res.data.userToken);
              localStorage.setItem("sender", username);
              navigate("/");
              location.reload();
            } else {
              setIsLoading(false);
              toast.error(res.data, toastOptions);
            }
          }
        });
    } else {
      alert("Do not leave fields empty!");
    }
  };
  return (
    <main className="login-main">
      <div className="login-container">
        <div className="title">ChatApp Login</div>
        <div className="login-content">
          <form>
            <div className="login-user-details">
              <div className="login-input-box">
                <span className="login-details">Username</span>
                <input
                  name="username"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="login-input-box">
                <span className="login-details">Password</span>
                <input
                  name="password"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <div className="button-div">
              <button onClick={handleClick} className="login-button">
                <>
                  {isLoading ? (
                    <img
                      className="loading-icon"
                      src="/image/loading-gif.gif"
                      alt="loading...."
                    />
                  ) : (
                    "Login"
                  )}
                </>
              </button>
            </div>
          </form>
        </div>
        <p>
          New user? <a href="/register">Register</a> here!
        </p>
      </div>
      <ToastContainer></ToastContainer>
    </main>
  );
}

export default Login;
