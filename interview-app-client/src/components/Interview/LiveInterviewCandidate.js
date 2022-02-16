const LiveInterviewCandidate = ({
  props: {
    interviewId,
    questions,
    currentQuestion,
    setAnswer,
    setCurrentQuestion,
    answerUpdate,
    endInterview,
    info,
  },
}) => {
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
            onClick={endInterview}
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
  );
};

export default LiveInterviewCandidate;
