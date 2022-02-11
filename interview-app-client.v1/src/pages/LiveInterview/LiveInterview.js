import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ApiFactory from "../../services/Service";

let socket;

const LiveInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const interviewId = window.location.search.split("=")[1];
  const api = ApiFactory.getResourceApiInstance();

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    api.get("interview", interviewId).then((r) => {
      setQuestions((q) => (q = r[0].questions));
      setCurrentQuestion(r[0].questions[0]);
      return r;
    });
    socket = io(ENDPOINT);

    socket.emit("connection", { candidate: "Candidate 1" }, () => {});
    console.log(questions);
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
                <h4>MCQ Quiz</h4>
                <span>(5 of 20)</span>
              </div>
            </div>
            <div className="question bg-white p-3 border-bottom">
              <div className="d-flex flex-row align-items-center question-title">
                <h3 className="text-danger">Q.</h3>
                <h5 className="mt-1 ml-2">
                  {currentQuestion ? currentQuestion.name : "ZEaRO"}
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
                className="btn btn-primary d-flex align-items-center btn-danger"
                type="button"
              >
                <i className="fa fa-angle-left mt-1 mr-1"></i>&nbsp;previous
              </button>
              <button
                className="btn btn-primary border-success align-items-center btn-success"
                type="button"
              >
                Next<i className="fa fa-angle-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
