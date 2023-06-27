const express = require("express");
require('dotenv').config();

const translateRouter = require("./routers/Translatetext")
const traslatetoaudio = require("./routers/Translatetoaudio")

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json())
app.use(translateRouter)
app.use(traslatetoaudio)

app.listen('3000', () => {
  console.log("Server is up on port 3000");
});
