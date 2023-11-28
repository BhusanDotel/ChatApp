const { Server } = require("socket.io");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
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
};

module.exports = initSocket;
