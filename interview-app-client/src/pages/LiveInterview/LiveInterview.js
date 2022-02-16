import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ApiFactory from "../../services/Service";
import useToken from "../../hooks/useToken";
import ROLES from "../../config/roles";
import config from "../../config/config";
import "./LiveInterview.css";
import AdminInterviewTracker from "../../components/admin/AdminInterviewTracker";
import LiveInterviewCandidate from "../../components/Interview/LiveInterviewCandidate";

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

    // Init socket, emit starting event and add listeners
    socket = io(config.LIVE_INTERVIEW_SERVICE);
    socket.emit("connection", { interviewId }, () => {});
    socket.emit("interviewStart", { interviewId }, () => {});
    updateInterviewStatus("In progress");
    socket.on(
      "recievedAnwer",
      (answers) => {
        setAnswers(answers);
      },
      []
    );
    socket.on("interviewEnded", () => {
      alert("Interview ended");
      window.location.href = "interviews";
      updateInterviewStatus("Completed");
    });
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

  const updateInterviewStatus = async (status) => {
    await api.patch(`interview/${interviewId}`, { Status: status });
  };

  const endInterview = () => {
    updateInterviewStatus("Completed");
    socket.emit("endInterview", { answers, interviewId }, () => {});
    window.location.href = "interviews";
  };

  return user.role !== ROLES.INTERVIEWER ? (
    <LiveInterviewCandidate
      props={{
        info,
        questions,
        interviewId,
        currentQuestion,
        setAnswer,
        setCurrentQuestion,
        answerUpdate,
        endInterview,
      }}
    />
  ) : (
    <AdminInterviewTracker answers={answers} />
  );
};

export default LiveInterview;
