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
  socket.on("interviewStart", ({ interviewId }, callback) => {
    socket.join("interviewId");

    callback();
  });

  socket.on("answerUpdate", ({ answers }, callback) => {
    socket.broadcast.to("interviewId").emit("recievedAnwer", answers);
    socket.join("interviewId");

    callback({ type: "Info", message: "Answer saved!" });
  });

  socket.on("disconnect", () => {
    console.log("Candidate disconnected from the interview!");
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
