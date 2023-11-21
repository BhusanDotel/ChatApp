import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Register.css";

function Register() {
  const [userDetail, setUserDetail] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const _userDetail = { ...userDetail };
    _userDetail[e.target.name] = e.target.value;
    setUserDetail(_userDetail);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const { username, email, password } = userDetail;
    if (username !== "" && email !== "" && password !== "") {
      try {
        await axios
          .post("http://localhost:3000/api/register", {
            username,
            email,
            password,
          })
          .then((res) => {
            if (res.data) {
              alert(res.data);
              if (res.data === "Registered Successfully!") {
                navigate("/");
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Do not leave fields empty");
    }
  };

  return (
    <>
      <main className="chat-container-root">
        <form className="register-input-fields">
          <h1>Register</h1>
          <input
            type="text"
            className="chat-container-username"
            name="username"
            value={userDetail.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="text"
            className="chat-container-email"
            name="email"
            value={userDetail.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            className="chat-container-password"
            name="password"
            value={userDetail.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <button className="chat-container-button" onClick={handleClick}>
            Register
          </button>
        </form>
      </main>
    </>
  );
}

export default Register;
