import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
  const parameter = useParams();
  const userName = parameter.userName;
  const [userDetails, setUserDetails] = React.useState({
    userName: "",
    email: "",
    dp: "",
  });

  React.useEffect(() => {
    async function getData() {
      await axios
        .post("http://localhost:3000/api/getuserdata", { userName })
        .then((res) => {
          if (res.data) {
            const _userDetails = { ...userDetails };
            _userDetails.userName = res.data.username;
            _userDetails.email = res.data.email;
            _userDetails.dp = res.data.dp;
            setUserDetails(_userDetails);
          }
        });
    }
    getData();
  }, []);

  return (
    <>
      <h1>{userName}</h1>
      <div>Name: {userDetails.userName}</div>
      <div>Email: {userDetails.email}</div>
      <div>Dp : {userDetails.dp}</div>
    </>
  );
}

export default Profile;
