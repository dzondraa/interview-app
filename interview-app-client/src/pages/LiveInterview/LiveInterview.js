import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ApiFactory from "../../services/Service";
import useToken from "../../hooks/useToken";
import ROLES from "../../config/roles";
import config from "../../config/config";
import "./LiveInterview.css";

let socket;

const LiveInterview = () => {
  const interviewId = window.location.search.split("=")[1];
  const api = ApiFactory.getResourceApiInstance();
  const tokenService = useToken();
  const user = tokenService.getLoggedInUser();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api
      .get("interview", interviewId)
      .then((r) => {
        checkAuth(r[0]);
        setQuestions((q) => (q = r[0].questions));
        setCurrentQuestion(0);
        setAnswers((a) => (a = r[0].questions));
      })
      .catch((er) => {
        console.log(er);
      });
    checkAuth();

    socket = io(config.LIVE_INTERVIEW_SERVICE);
    socket.emit("connection", { interviewId }, () => {});
    socket.emit("interviewStart", { interviewId }, () => {});
    socket.on(
      "recievedAnwer",
      (answers) => {
        setAnswers(answers);
      },
      []
    );
    // TODO -> Update status of interview to 'Running'
    return () => {
      socket.off();
    };
  }, []);

  const checkAuth = (interview = null) => {
    if (interview === null) return;
    const email = user.user.profileObj.email;
    const isAuthorized =
      email == config.INTERVIEWER || email == interview.interview.candidate;
    if (!isAuthorized) {
      alert(
        "You are trying to access another candidate's interview. Marked as malicious activity"
      );
      window.location.href = "interviews";
    }
  };

  const answerUpdate = () => {
    // const answer = document.getElementById("answer").value;
    var tempAnswers = [...answers];
    tempAnswers = answers;
    tempAnswers[currentQuestion].answer = answer;
    setAnswers((a) => (a = tempAnswers));
    socket.emit("answerUpdate", { answers, interviewId }, (res) => {
      handleInfo(res);
    });
  };

  const handleInfo = (info) => {
    var display =
      info.type == "Error" ? (
        <span className="badge badge-pill badge-danger">{info.message}</span>
      ) : (
        <span className="badge badge-pill badge-success">{info.message}</span>
      );

    setInfo(display);
    setTimeout(() => {
      setInfo(null);
    }, 3000);
  };

  return user.role !== ROLES.INTERVIEWER ? (
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
                <h3 className="text-danger">Q. </h3>
                <h5 className="mt-1 ml-2">
                  {questions.length > 0 &&
                    questions[currentQuestion].description}
                  {info ? info : null}
                </h5>
              </div>
              <textarea
                onChange={(e) => setAnswer(e.target.value)}
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
                onClick={answerUpdate}
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
          <button
            style={{
              float: "right",
              marginTop: "15px",
            }}
            type="button"
            className="btn btn-outline-success btn-lg"
          >
            End interview
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        marginTop: "50px",
      }}
      className="container"
    >
      <div className="list-group">
        {answers.map((question, key) => {
          return (
            <div key={key}>
              <a href="#" className="list-group-item list-group-item-action">
                <b>{question.description}</b>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                {question.answer ? (
                  question.answer
                ) : (
                  <span className="blink_me">Waiting on candidate...</span>
                )}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveInterview;
