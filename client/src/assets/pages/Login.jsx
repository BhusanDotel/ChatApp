import React from "react";
import axios from "axios";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [useDetail, setUserDetail] = React.useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const _userDetail = { ...useDetail };
    _userDetail[e.target.name] = e.target.value;
    setUserDetail(_userDetail);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { username, password } = useDetail;
    if (username !== "" && password !== "") {
      await axios
        .post("http://localhost:3000/api/login", {
          username,
          password,
        })
        .then((res) => {
          if (res.data) {
            alert(res.data);
            if (res.data === "Login Successfull!") {
              localStorage.setItem("sender", username);
              navigate("/");
            }
          }
        });
    } else {
      alert("Do not leave fields empty!");
    }
  };
  return (
    <main className="login-root">
      <div className="login-container">
        <h1>Login</h1>
        <input
          name="username"
          value={useDetail.username}
          onChange={handleChange}
          className="login-username-field"
          type="text"
          placeholder="Username"
        />
        <input
          name="password"
          value={useDetail.password}
          onChange={handleChange}
          className="login-password-field"
          type="text"
          placeholder="Password"
        />
        <button onClick={handleClick} className="login-button">
          Login
        </button>
      </div>
    </main>
  );
}

export default Login;
