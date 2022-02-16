const AdminInterviewTracker = ({ answers }) => {
  return (
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

export default AdminInterviewTracker;
