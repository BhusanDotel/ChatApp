import React from "react";
import { StateContext } from "./StateContext";

export const StateProvider = (props) => {
  const [receiverName, setReceiverName] = React.useState("empty");
  const [myUserName, setMyUserName] = React.useState("empty");

  React.useState(() => {
    async function getNames() {
      const receiver = localStorage.getItem("receiver");
      const sender = localStorage.getItem("sender");
      setMyUserName(sender);
      setReceiverName(receiver);
    }
    getNames();
  }, []);

  return (
    <StateContext.Provider
      value={{ receiverName, setReceiverName, myUserName, setMyUserName }}
    >
      {props.children}
    </StateContext.Provider>
  );
};
