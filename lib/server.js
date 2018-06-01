const express = require("express");
const app = express();
const server = app.listen(3000, function(err) {
  console.log("Server is On Port 3000")
});
// const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.get("/test", function(req,res) {
  res.send("Hello Tester");
})

var users = [];

io.on("connection", function(socket) {
  socket.on("initUser", function(data) {
    var idArray = Object.keys(io.sockets.sockets);
    var is = 0;
    idArray.forEach(function(value) {
      if(data.username == io.sockets.sockets[value].username) {
        socket.emit("overlap",{result : 0});
        is = 1;
        return;
      }
    })
    if(!is) {
      socket.username = data.username;
      io.emit("newUser",{username : data.username})
    }
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
  var conusers = setInterval(function() {
    var count = Object.keys(io.sockets.sockets).length;
    io.emit("conusers", {usercount : count});
  },1000)
})

// exports.run = function(port){
//   server.listen(port, function() {
//     console.log("Server is running at %s", port);
//   })
// }
