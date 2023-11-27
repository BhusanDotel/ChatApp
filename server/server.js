const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const { connected } = require("process");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/ChatApp")
  .then(() => {
    console.log("Mongodb connected: localhost:27017");
  })
  .catch((e) => {
    console.log("Error", e);
  });

app.use("/api", userRoute);
app.use("/api", chatRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const activeUsers = [];
io.on("connection", (socket) => {
  socket.on("username", (username) => {
    // Check if the user already exists in activeUsers array
    const existingUserIndex = activeUsers.findIndex(
      (user) => user.username === username
    );
    if (existingUserIndex !== -1) {
      // If user exists, update the sID
      activeUsers[existingUserIndex].sID = socket.id;
    } else {
      // If user doesn't exist, add a new entry
      const activeUser = { username: username, sID: socket.id };
      activeUsers.push(activeUser);
    }
    io.emit("activeUsers", activeUsers);
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("for_beep", (beep) => {
    socket.broadcast.emit("receive_beep", beep);
  });

  socket.on("disconnect", () => {
    let disconnectedUser = "";
    activeUsers.forEach((user) => {
      if (user.sID === socket.id) {
        disconnectedUser = user.username;
      }
    });
    const disconnetUserIndex = activeUsers.findIndex(
      (user) => user.username === disconnectedUser
    );
    if (disconnetUserIndex !== -1) {
      activeUsers.splice(disconnetUserIndex, 1);
      io.emit("activeUsers", activeUsers);
    }
  });
});

server.listen(3000, () => {
  console.log("App listening on port 3000!");
});
