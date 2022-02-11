const express = require("express");
const http = require("http");
const router = require("./router");
var cors = require("cors");
const PORT = process.env.PORT || 5000;

var app = express();
app.use(cors());
app.use(router);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Interview started!");

  socket.on("interviewStart", ({ interviewId }, callback) => {
    console.log("InterviewID: " + interviewId);

    // if (error) return callback(error);

    // socket.emit("message", {
    //   user: 'admin',
    //   text: `${user.name}, welcome to the room ${user.room}`,
    // });
    // socket.broadcast
    //   .to(user.room)
    //   .emit("message", { user: "admin", text: `${user.name}, has joined!` });
    // socket.join(user.room);

    callback();
  });

  socket.on("answerUpdate", ({ answers }, callback) => {
    console.log(answers)

    callback({type:'Info', message:'Answer saved!'})
  });

  socket.on("disconnect", () => {
    console.log("Candidate disconnected from the interview!");
    // const user = removeUser(socket.id)

    // if(user) {
    // io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left!`})
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
