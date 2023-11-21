import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./assets/pages/Register";
import Login from "./assets/pages/Login";
import Chat from "./assets/pages/Chat";
import { StateContext } from "./assets/context/StateContext";

function App() {
  const { isLoggedIn } = React.useContext(StateContext);
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route index element={isLoggedIn ? <Chat /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
