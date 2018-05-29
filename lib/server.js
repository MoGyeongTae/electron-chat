const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)

const users = new Set();

io.on("connection", function(socket) {
  socket.on("initUser", function(data) {
    if(users.has(data.username)) {
      socket.emit("overlap",{result : 0});
      return;
    }
    users.add(data.username);
    io.emit("newUser",{username : data.username})
  })
  socket.on("sendChat", function(data) {
    io.emit("receiveChat",{username : data.username, message : data.message});
  })


  socket.on("disconnect", function() {

  })
})

exports.run = function(port){
  server.listen(port, function() {
    console.log("Server is running at %s", port);
  })
}
