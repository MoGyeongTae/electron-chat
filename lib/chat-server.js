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

var conusers = setInterval(function() {
  io.in("1").clients(function(err,client) {
    var count = client.length;
    var nickArray = []
    client.forEach(function(value) {
      nickArray.push({username : io.sockets.sockets[value].username, id : value})
    })
    console.log(nickArray)
    io.to("1").emit("conusers", {usercount : count, userlist : nickArray});
  })
  io.in("2").clients(function(err,client) {
    var count = client.length;
    var nickArray = []
    client.forEach(function(value) {
      nickArray.push({username : io.sockets.sockets[value].username, id : value})
    })
    io.to("2").emit("conusers", {usercount : count, userlist : nickArray});
  })
},2000)

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
      socket.join("1")
    }
  })
  socket.on("sendChat", function(data) {
      io.to(data.channel).emit("receiveChat",{username : data.username, message : data.message});
  })

  // Start Chat and End Chat BroadCast
  socket.on("startChat", function(data) {
    socket.to(data.channel).broadcast.emit("chatStart")
  })
  socket.on("endChat", function(data) {
    socket.to(data.channel).broadcast.emit("chatEnd")
  })

  socket.on("sendChannel", function(data) {
    socket.leave(data.currentChannel);
    socket.join(data.nextChannel);
    socket.emit("changeChannel",{channel : data.nextChannel});
    io.to(data.nextChannel).emit("system:join",{message : socket.username + "님이 접속하셨습니다"});
    io.to(data.currentChannel).emit("system:leave",{message : socket.username + "님이 나가셨습니다"});
  })

  socket.on("sendImage", function(data) {
    io.to(data.channel).emit("receiveImage", {username : data.username, url : data.url, channel : data.channel})
  })

  socket.on("sendWhisper", function(data) {
    var id = data.whisper;
    var username = data.username;
    var message = data.message;

    io.to(id).emit("receiveWhisper",{username : username , message : message})
    io.to(socket.id).emit("receiveWhisper",{username : username , message : message})
  })

  socket.on("disconnect", function() {
  })
})
