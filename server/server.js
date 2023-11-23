const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
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

io.on("connection", (socket) => {
  // console.log(`Connected User: ${socket.id}`);
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
    //socket.emit to single user
    //socket.boradcast.emit to all connected user except sender
    //io.emit to all clients connected including sender
  });
});

server.listen(3000, () => {
  console.log("App listening on port 3000!");
});
