import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./assets/pages/Register";
import Login from "./assets/pages/Login";
import Chat from "./assets/pages/Chat";
import Profile from "./assets/pages/Profile";
import { StateContext } from "./assets/context/StateContext";

function App() {
  const { isLoggedIn } = React.useContext(StateContext);
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route index element={isLoggedIn ? <Chat /> : <Login />} />
        <Route path="/:userName" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
