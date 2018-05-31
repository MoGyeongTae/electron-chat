const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)

var users = [];

io.on("connection", function(socket) {
  socket.on("initUser", function(data) {
    if(users.indexOf(data.username) > 0) {
      socket.emit("overlap",{result : 0});
      return;
    }
    users.push(data.username);
    io.emit("newUser",{username : data.username})
  })
  socket.on("sendChat", function(data) {
    io.emit("receiveChat",{username : data.username, message : data.message});
  })

  // Start Chat and End Chat BroadCast
  socket.on("startChat", function(data) {
    socket.broadcast.emit("chatStart")
  })
  socket.on("endChat", function(data) {
    socket.broadcast.emit("chatEnd")
  })

  socket.on("disconnect", function() {

  })
})

exports.run = function(port){
  server.listen(port, function() {
    console.log("Server is running at %s", port);
  })
}
