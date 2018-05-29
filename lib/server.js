const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)

const users = new Set();

io.on("connection", function(socket) {
  let username;

})

exports.run = function(port){
  server.listen(port, function() {
    console.log("Server is running at %s", port);
  })
}
