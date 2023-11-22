const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
