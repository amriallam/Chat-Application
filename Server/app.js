const io = require("socket.io")(3000, {cors: {origin: "*"}});

io.on("connection", (socket) => {
  console.log('\x1b[36m%s',`${socket.id} Connected`);
  socket.on("checkRoomExistance", (roomId) => {
    if (io.sockets.adapter.rooms.get(roomId)) {
      socket.emit("RoomResult", 1);;
    } else {
      socket.emit("RoomResult", 0);
    }
  });
  socket.on("createRoom",()=>{
    socket.join(socket.id);
    console.log('\x1b[35m%s',`${socket.id} Hosted his own room`)
  })
  socket.on("joinMe", (roomid,userName) => {
    io.to(roomid).emit("userJoined",userName)
    socket.join(roomid);
    console.log('\x1b[33m%s',`${socket.id} Joined ${roomid}`);
  });
  socket.on('disconnect',()=>{
    console.log('\x1b[31m%s',`${socket.id} Disconnected`);
    
  });
  socket.on('send-message',(massage,sender,lobbyId)=>io.to(lobbyId).emit("receive-message",massage,sender));
  socket.on('leaveLobby',(roomId,userId)=>{
    socket.leave(roomId);
    io.to(roomId).emit("leftLobby",userId);
    console.log('\x1b[35m%s',`${socket.id} Hosted his own room`)
  }
  );
});
