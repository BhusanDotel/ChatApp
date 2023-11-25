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
  const [imageSrc, setImageSrc] = React.useState("");
  const [dpImage, setDpImage] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  const handleDpClick = () => {
    fileInputRef.current.click();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
    }
    setDpImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    const _userDetail = { ...userDetail };
    _userDetail[e.target.name] = e.target.value;
    setUserDetail(_userDetail);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, password } = userDetail;
    if (username && email && password) {
      const formData = new FormData();
      formData.append("image", dpImage);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      try {
        await axios
          .post("http://localhost:3000/api/register", formData)
          .then((res) => {
            if (res.data) {
              setLoading(false);
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

  const defaultImage =
    "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

  return (
    <>
      <main className="chat-container-root">
        <form className="register-input-fields">
          <h1>Register</h1>
          <img
            onClick={handleDpClick}
            className="dp-image-viewer"
            src={imageSrc === "" ? defaultImage : imageSrc}
            alt="dp"
          />
          <input
            type="text"
            className="chat-container-username"
            name="username"
            value={userDetail.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
            className="chat-container-image"
            onChange={handleImage}
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
            <>
              {isLoading ? (
                <img
                  className="loading-icon"
                  src="/image/loading-gif.gif"
                  alt="loading...."
                />
              ) : (
                "Register"
              )}
            </>
          </button>
        </form>
      </main>
    </>
  );
}

export default Register;
