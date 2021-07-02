// This file is in charge of api endpoints and the
// api server stuff

// import express so you can use it
const express = require("express");
const Link  = require("./model");
// local file storage
const fs = require('fs');
const cors = require("cors");
// instantiate your app/server
const app = express();

app.use(cors());

app.use(express.static("static"));

// tell our app to use json (this is an example of a middleware but this one
// is implemented for us)
app.use(express.json({}));

// this is where we will do our own middleware
app.use((req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});



module.exports = app;
