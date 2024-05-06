const { Server } = require("socket.io");

const io = new Server(2000, {
  cors: true,
});

const EmailtoSocketId = new Map();
const socketToEmail = new Map();

io.on("connection", (socket) => {
  console.log(`socket conneted ${socket.id}`);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    EmailtoSocketId.set(email, socket.id);
    socketToEmail.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });
});
