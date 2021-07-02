// This file is in charge of database connection

const mongoose = require("mongoose");

function connect(callback) {
  let connectionString = `mongodb+srv://dz:0penS1mian1@firstcluster.yqwhp.mongodb.net/FirstCluster?retryWrites=true&w=majority`;

  console.log("connect to db....");

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.log("There was an error connecting to mongo: ", err);
    });

  mongoose.connection.once("open", callback);
}

module.exports = {
  connect,
};
