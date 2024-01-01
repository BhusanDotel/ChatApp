const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const initSocket = require("./SocketService");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoCloud_url = process.env.MONGO_CLOUD_URL;
mongoose
  .connect(mongoCloud_url)
  .then(() => {
    console.log("Mongodb connected to cloud..");
  })
  .catch((e) => {
    console.log("Error", e);
  });

app.use("/api", userRoute);
app.use("/api", chatRoute);

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log("App listening on port 3000!");
});
