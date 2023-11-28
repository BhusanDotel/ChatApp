import React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../style/Register.css";
import { registerApi } from "../Utils/ApiRoutes";

function Register() {
  const [userDetail, setUserDetail] = React.useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    gender: "",
  });
  const [gender, setGender] = React.useState("");
  const [imageSrc, setImageSrc] = React.useState("");
  const [dpImage, setDpImage] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

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

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { fullname, username, email, phone, password, cpassword, gender } =
      userDetail;
    if (fullname && username && email && phone && password) {
      setLoading(true);
      if (password === cpassword) {
        const formData = new FormData();
        formData.append("image", dpImage);
        formData.append("fullname", fullname);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("cpassword", cpassword);
        formData.append("gender", gender);
        try {
          await axios.post(registerApi, formData).then((res) => {
            if (res.data) {
              if (res.data === "Registered Successfully!") {
                toast.success(res.data, toastOptions);
                setTimeout(() => {
                  navigate("/");
                }, 2000);
              } else {
                setLoading(false);
                toast.error(res.data, toastOptions);
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("Do not leave fields empty");
    }
  };

  const defaultImage =
    "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

  return (
    <div className="reg-main">
      <div className="reg-container">
        <div className="title">ChatApp Register</div>
        <div className="content">
          <form>
            <img
              onClick={handleDpClick}
              className="dp-image-viewer"
              src={imageSrc ? imageSrc : defaultImage}
              alt="dp"
            />
            <input
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
              className="chat-container-image"
              onChange={handleImage}
            />
            <div className="user-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  name="fullname"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  name="username"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  name="email"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="text"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  name="phone"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="text"
                  placeholder="Enter your number"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  name="password"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="input-box">
                <span onChange={handleChange} className="details">
                  Confirm Password
                </span>
                <input
                  type="password"
                  name="cpassword"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressed}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            <div className="gender-info">
              <label className="male-label">
                <input
                  className="male-radio-btn"
                  type="radio"
                  value="male"
                  name="gender"
                  onChange={handleChange}
                />
                Male
              </label>
              <label className="female-label">
                <input
                  className="female-radio-btn"
                  type="radio"
                  value="male"
                  name="gender"
                  onChange={handleChange}
                />
                Female
              </label>
            </div>
            <div className="button-div">
              <button onClick={handleClick} className="reg-button">
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
            </div>
          </form>
        </div>
        <p>
          Already an user? <a href="/login">login</a> here!
        </p>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Register;
