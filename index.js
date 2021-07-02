// This file is in charge of starting the application
const server = require("./server");
const persist = require("./persist");

// define a port
const portNumber = process.argv[2] || process.env.PORT || 8080;

// connect to the database
persist.connect(function () {
  // start the server
  server.listen(portNumber, () => {
    console.log(`Running Server on Port ${portNumber}`);
  });
});

//update comment
