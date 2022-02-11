import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ApiFactory from "../../services/Service";

let socket;

const LiveInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const interviewId = window.location.search.split("=")[1];
  const api = ApiFactory.getResourceApiInstance();

  const ENDPOINT = "http://localhost:5000";
  useEffect(() => {
    api
      .get("interview", interviewId)
      .then((r) => {
        setQuestions((q) => (q = r[0].questions));
        setCurrentQuestion(0);
        setAnswers((a) => (a = r[0].questions));
      })
      .catch((er) => {
        console.log(er);
      });

    socket = io(ENDPOINT);
    socket.emit("connection", { interview: interviewId }, () => {});
    socket.emit("interviewStart", { interviewId: interviewId }, () => {});

    // TODO -> Update status of interview to 'Running'
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on(
      "saveAnswers",
      (message) => {
        console.log(message);
      },
      []
    );
  });

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center row">
        <div className="col-md-10 col-lg-10">
          <div className="border">
            <div className="question bg-white p-3 border-bottom">
              <div className="d-flex flex-row justify-content-between align-items-center mcq">
                <h4>InterviewID {interviewId}</h4>
                <span>
                  ({currentQuestion + 1} of {questions.length})
                </span>
              </div>
            </div>
            <div className="question bg-white p-3 border-bottom">
              <div className="d-flex flex-row align-items-center question-title">
                <h3 className="text-danger">Q.</h3>
                <h5 className="mt-1 ml-2">
                  {questions.length > 0 &&
                    questions[currentQuestion].description}
                </h5>
              </div>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
              <button
                onClick={() => {
                  if (currentQuestion - 1 >= 0)
                    setCurrentQuestion((e) => (e = e - 1));
                }}
                className="btn btn-primary d-flex align-items-center btn-danger"
                type="button"
              >
                previous
              </button>

              <button
                onClick={() => {}}
                className="btn btn-primary d-flex align-items-center btn-information"
                type="button"
              >
                Save answers
              </button>
              <button
                onClick={() => {
                  if (questions.length > currentQuestion + 1)
                    setCurrentQuestion((e) => (e = e + 1));
                }}
                className="btn btn-primary border-success align-items-center btn-success"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
