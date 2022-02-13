const express = require("express");
const http = require("http");
const router = require("./router");
var cors = require("cors");
const PORT = process.env.PORT || 5000;
const amqp = require("amqplib/callback_api");

// Connect to message broker
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "interview";
    var msg = { interviewData: { q1: "asdasd" } };

    // channel.assertQueue(queue, {
    //   durable: false
    // });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    console.log(" [x] Sent %s", msg);
  });
});

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

  socket.on("endInterview", ({ interviewId }, callback) => {
    socket.broadcast.to(interviewId).emit("interviewEnded", null);
    socket.join(interviewId);

    callback();
  });

  socket.on("answerUpdate", ({ answers, interviewId }, callback) => {
    socket.broadcast.to(interviewId).emit("recievedAnwer", answers);
    socket.join(interviewId);

    callback({ type: "Info", message: "Answer saved!" });
  });

  socket.on("disconnect", () => {
    console.log("Candidate disconnected from the interview!");
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
