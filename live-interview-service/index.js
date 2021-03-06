const express = require("express");
const http = require("http");
const router = require("./router");
var cors = require("cors");
const PORT = process.env.PORT || 5000;
require("./messagingService");

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
    socket.join(interviewId);

    callback();
  });

  socket.on("endInterview", ({ answers, interviewId }, callback) => {
    socket.broadcast.to(interviewId).emit("interviewEnded", null);
    socket.join(interviewId);
    notifyResourceService(
      JSON.stringify({
        interviewId: interviewId,
        answers: answers,
      })
    );
    callback();
  });

  socket.on("answerUpdate", ({ answers, interviewId }, callback) => {
    socket.broadcast.to(interviewId).emit("recievedAnwer", answers);
    socket.join(interviewId);
    answersGlobal = answers;
    callback({ type: "Info", message: "Answer saved!" });
  });

  socket.on("disconnect", () => {
    console.log("Candidate disconnected from the interview!");
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
