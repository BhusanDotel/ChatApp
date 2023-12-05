import React from "react";
import { StateContext } from "../context/StateContext";
import axios from "axios";
import "../style/Profile.css";
import { getUserDataApi } from "../Utils/ApiRoutes";
import { setUserDataApi } from "../Utils/ApiRoutes";
import { deleteAccountApi } from "../Utils/ApiRoutes";

function Profile() {
  const { myUserName } = React.useContext(StateContext);
  const [userDetails, setUserDetails] = React.useState({
    fullname: "",
    userName: "",
    email: "",
    phone: "",
    dp: "",
  });
  const [trigger, setTrigger] = React.useState(0);

  const [newFullName, setNewFullName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [isFullNameEdit, setIsFullNameEdit] = React.useState(false);
  const [isEmailEdit, setIsEmailEdit] = React.useState(false);
  const [isPhoneEdit, setIsPhoneEdit] = React.useState(false);
  const [isPasswordEdit, setIsPasswordEdit] = React.useState(false);

  const [isFullNameEditCancel, setIsFullNameEditCancel] = React.useState(true);
  const [isEmailEditCancel, setIsEmailEditCancel] = React.useState(true);
  const [isPhoneEditCancel, setIsPhoneEditCancel] = React.useState(true);
  const [isPasswordEditCancel, setIsPasswordEditCancel] = React.useState(true);

  const editFullName = () => {
    setIsFullNameEdit(true);
    setIsFullNameEditCancel(false);
  };
  const handleFullName = (e) => {
    setNewFullName(e.target.value);
  };
  const cancelFullNameEdit = () => {
    setIsFullNameEdit(false);
    setIsFullNameEditCancel(true);
  };

  const editEmail = () => {
    setIsEmailEdit(true);
    setIsEmailEditCancel(false);
  };
  const handleEmail = (e) => {
    setNewEmail(e.target.value);
  };
  const cancelEmailEdit = () => {
    setIsEmailEdit(false);
    setIsEmailEditCancel(true);
  };

  const editPhone = () => {
    setIsPhoneEdit(true);
    setIsPhoneEditCancel(false);
  };
  const handlePhone = (e) => {
    setNewPhone(e.target.value);
  };
  const cancelPhoneEdit = () => {
    setIsPhoneEdit(false);
    setIsPhoneEditCancel(true);
  };

  const saveNewFullName = () => {
    changeTrigger();
  };
  const saveEmail = () => {
    changeTrigger();
  };
  const savePhone = () => {
    changeTrigger();
  };

  const changePassword = () => {
    setIsPasswordEdit(true);
  };
  const cancelChangePassword = () => {
    setIsPasswordEdit(false);
  };
  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const savePassword = () => {
    if (oldPassword && newPassword) {
      changeTrigger();
    } else {
      alert("Provide all Password");
    }
  };

  const changeTrigger = () => {
    setTrigger((prevState) => {
      return prevState + 1;
    });
  };

  React.useEffect(() => {
    const sendData = async () => {
      try {
        await axios
          .post(setUserDataApi, {
            myUserName,
            newFullName,
            newEmail,
            newPhone,
            oldPassword,
            newPassword,
          })
          .then((res) => {
            if (res.data) {
              if (res.data.status) {
                if (res.data.status === "ok") {
                  location.reload();
                }
              } else {
                alert(res.data);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  }, [trigger]);

  React.useEffect(() => {
    async function getData() {
      await axios.post(getUserDataApi, { myUserName }).then((res) => {
        if (res.data) {
          const _userDetails = { ...userDetails };
          _userDetails.fullname = res.data.fullname;
          _userDetails.userName = res.data.username;
          _userDetails.email = res.data.email;
          _userDetails.phone = res.data.phone;
          _userDetails.dp = res.data.dp;
          setUserDetails(_userDetails);
        }
      });
    }
    getData();
  }, []);

  const deleteAccount = async () => {
    const confirmText = prompt(`Type "CONFIRM" to proceed`);
    if (confirmText) {
      axios
        .post(deleteAccountApi, {
          myUserName,
          confirmText,
        })
        .then((res) => {
          if (res.data) {
            if (res.data === `Type "CONFIRM" to proceed`) {
              alert(res.data);
              deleteAccount();
            } else if (res.data === "account deleted") {
              localStorage.clear();
              location.reload();
            }
          }
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <main className="profile-root">
      <div className="profile-container">
        <h1>{myUserName}</h1>
        <img className="profilepage-dp" src={userDetails.dp} alt="" />

        <div className="profile-data-container fullname-container">
          <div>
            Full Name: {""}
            {!isFullNameEdit ? (
              userDetails.fullname
            ) : (
              <input onChange={handleFullName} type="text" />
            )}
          </div>
          {isFullNameEditCancel ? (
            <button className="profile-data-edit-button" onClick={editFullName}>
              Edit
            </button>
          ) : newFullName ? (
            <button
              className="profile-data-edit-button"
              onClick={saveNewFullName}
            >
              Save
            </button>
          ) : (
            <button
              className="profile-data-edit-button"
              onClick={cancelFullNameEdit}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="profile-data-container email-container">
          <div>
            Email: {""}
            {!isEmailEdit ? (
              userDetails.email
            ) : (
              <input onChange={handleEmail} type="email" />
            )}
          </div>
          {isEmailEditCancel ? (
            <button className="profile-data-edit-button" onClick={editEmail}>
              Edit
            </button>
          ) : newEmail ? (
            <button className="profile-data-edit-button" onClick={saveEmail}>
              Save
            </button>
          ) : (
            <button
              className="profile-data-edit-button"
              onClick={cancelEmailEdit}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="profile-data-container phone-container">
          <div>
            Phone: {""}
            {!isPhoneEdit ? (
              userDetails.phone
            ) : (
              <input onChange={handlePhone} type="number" />
            )}
          </div>
          {isPhoneEditCancel ? (
            <button className="profile-data-edit-button" onClick={editPhone}>
              Edit
            </button>
          ) : newPhone ? (
            <button className="profile-data-edit-button" onClick={savePhone}>
              Save
            </button>
          ) : (
            <button
              className="profile-data-edit-button"
              onClick={cancelPhoneEdit}
            >
              Cancel
            </button>
          )}
        </div>

        {isPasswordEdit && (
          <div className="password-container">
            <input
              type="text"
              onChange={handleOldPassword}
              placeholder="Recent Password"
            />
            <input
              type="text"
              onChange={handleNewPassword}
              placeholder="New Password"
            />
          </div>
        )}
        {!isPasswordEdit ? (
          <button onClick={changePassword}>change password</button>
        ) : newPassword ? (
          <button onClick={savePassword}>Save</button>
        ) : (
          <button onClick={cancelChangePassword}>Cancel</button>
        )}
        <p onClick={deleteAccount} className="delete-account-text">
          Delete Account
        </p>
        <p className="logout-text-profile" onClick={handleLogout}>
          Logout
        </p>
      </div>
    </main>
  );
}

export default Profile;
