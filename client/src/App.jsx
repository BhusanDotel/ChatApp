import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./assets/pages/Register";
import Login from "./assets/pages/Login";
import Chat from "./assets/pages/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
