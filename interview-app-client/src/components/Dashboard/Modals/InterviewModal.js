import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiFactory from "../../../services/Service";
const InterviewModal = ({
  modalOpen,
  handleShow,
  handleClose,
  selectedInterview,
}) => {
  const api = ApiFactory.getResourceApiInstance();
  const [interviewDetails, setInterviewDetails] = useState(null);

  useEffect(() => {
    api
      .get("interview", selectedInterview)
      .then((res) => setInterviewDetails(res[0]))
      .catch((ex) => console.log(ex));
  }, []);

  const startInterview = () => {
    window.location.href = `live?interview=${interviewDetails.interview.id}`;
  };
  return interviewDetails ? (
    <Modal show={modalOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Interview details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card col-lg-12">
          <div className="card-body">
            <b>Date</b>
            <p>{new Date(interviewDetails.interview.date).toDateString()}</p>
          </div>
          <div className="card-body">
            <b>Time</b>
            <p>{new Date(interviewDetails.interview.date).toTimeString()}</p>
          </div>
          <div className="card-body">
            <b>Questions:</b>
            {interviewDetails.questions.map((question, key) => {
              return <li key={key}>{question.description}</li>;
            })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {interviewDetails.interview.status == "Planned" ||
        interviewDetails.interview.status == "In progress" ? (
          <Button variant="primary" onClick={startInterview}>
            {interviewDetails.interview.status == "Planned"
              ? "Start interview"
              : "Join interview"}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default InterviewModal;
