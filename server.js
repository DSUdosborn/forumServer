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

server.use(demoLogger);

module.exports = server;

server.get("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("getting all threads");
  Thread.find({}, (err, threads) => {
    // check if error is null
    if (err != null) {
      res.status(500).json({
        error: err,
        message: "could not list threads",
      });
      return;
    }
    res.status(200).json(threads);
  });
});


// GET /thread/:id
server.get("/thread/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`getting thread with id ${req.params.id}`);
  Thread.findById(req.params.id, (err, thread) => {
    if (err != null) {
      res.status(500).json({
        error: err,
        message: "Could not process thread request"
      });
      return;
    } else if (thread === null) {
      res.status(404).json({
        message: "Could not find thread"
      })
      return;
    }
    res.status(200).json(thread)
  });
});

// POST /thread
server.post("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating thread with body`, req.body);

  let newThread = {
    author: req.body.author || "",
    name: req.body.name || "",
    description: req.body.description || "",
    posts: [],
    category: req.body.category || "all",
  };

  Thread.create(newThread, (err, thread) => {
      if (err != null) {
        console.log(`unable to create thread`);
        res.status(500).json({
          message: "unable to create thread",
          error: err,
        });
        return;
      }
    res.status(201).json(thread)
    }
  );
});

// DELETE /thread/:id
server.delete("/thread/:id",(req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`deleting thread with id: ${req.params.id}`);

  Thread.findByIdAndDelete(req.params.id, function (err, thread) {
    if (err != null) {
      res.status(500).json({
        error: err,
        message: "Could not process thread request"
      });
      return;
      } else if (thread === null) {
        res.status(404).json({
          message: "Could not find thread"
        })
      }
      res.status(200).json(thread);
  });
});


// POST /post
server.post("/post", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating post with body`, req.body);

  let newPost = {
    author: req.body.author || "",
    body: req.body.body || "",
    thread_id: req.body.thread_id || "",
  };

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    {
      $push: { posts: newPost },
    },
    {
      new: true,
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "could not add post",
        });
      } else if (thread === null) {
        res.status(400).json({
          error: err,
          message: "could not find thread",
        });
        return;
      }
      res.status(200).json(thread.posts[thread.posts.length - 1]);
    }
  );
});

// DELETE /post/:thread_id/:post_id
server.delete("/post/:thread_id/:post_id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(
    `deleting post with id ${req.params.post_id} on thread with id ${req.params.thread_id}`
  );
  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $pull: {
        posts: {
          _id: req.params.post_id,
        },
      },
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "could not delete post",
        });
      } else if (thread === null) {
        res.status(400).json({
          error: err,
          message: "could not find thread",
        });
        return;
      }
      // find the post that was deleted
      let post;
      thread.posts.forEach((e) => {
        if (e._id == req.params.post_id) {
          post = e;
        }
      });
      // if you can't find it return 404
      if (post == undefined) {
        res.status(404).json({
          error: err,
          message: "could not find post",
        });
        return;
      }
      // success
      res.status(200).json(post);
    }
  );
});
