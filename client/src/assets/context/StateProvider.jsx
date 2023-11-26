import React from "react";
import { StateContext } from "./StateContext";

export const StateProvider = (props) => {
  const [receiverName, setReceiverName] = React.useState();
  const [myUserName, setMyUserName] = React.useState("empty");
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  React.useState(() => {
    async function getLocalData() {
      const receiver = localStorage.getItem("receiver");
      const sender = localStorage.getItem("sender");
      const authToken = localStorage.getItem("authToken");
      setMyUserName(sender);
      setReceiverName(receiver);
      if (authToken) {
        setLoggedIn(true);
      }
    }
    getLocalData();
  }, []);

  return (
    <StateContext.Provider
      value={{
        receiverName,
        setReceiverName,
        myUserName,
        setMyUserName,
        isLoggedIn,
        setLoggedIn,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};
