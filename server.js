// This file is in charge of api endpoints and the
// api server stuff

// import express so you can use it
const express = require("express");
const Link  = require("./model");
// local file storage
const fs = require('fs');
const cors = require("cors");
// instantiate your server/server
const server = express();

const {Thread} = require("./model");

server.use(cors());

server.use(express.static("static"));

// tell our server to use json (this is an example of a middleware but this one
// is implemented for us)
server.use(express.json({}));

// this is where we will do our own middleware
server.use((req, res, next) => {

  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();

  console.log(
    "Time: ",
    formatted_date,
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

let demoLogger = (req, res, next) => {
  //middleware function
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  console.log(log);
  fs.appendFile("request_logs.txt", log + "\n", (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
};

module.exports = server;

// GET /thread
server.get("/thread",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log("Getting all threads");
  res.json([]);
});

// GET /thread/:id
server.get("/thread/:id",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log(`Getting thread with id  $(req.params.id)`);
  res.json([]);
});

// POST /thread
server.post("/thread",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log("Post new thread");
  res.json([]);
});

// DELETE /thread/:id
server.delete("/thread/:id",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log(`Getting thread with id  $(req.params.id)`);
  res.json([]);
});

// POST /post
server.post("/post",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log("Posting new thread");
  res.json([]);
});

// DELETE /post/:thread_id/:post_id
server.delete("/thread/:id",(req, res) => {
  res.setHeader("Content-Type","application/json");
  console.log(`deleting post from  thread with id  $(req.params.id)`);
  res.json([]);
});
