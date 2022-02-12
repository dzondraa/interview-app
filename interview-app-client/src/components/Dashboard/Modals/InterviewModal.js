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
        <b>Date</b> {new Date(interviewDetails.interview.date).toDateString()}
        <br />
        <b>Time</b> {new Date(interviewDetails.interview.date).toTimeString()}
        <br></br>
        <b>Questions:</b>
        {interviewDetails.questions.map((question, key) => {
          return <p key={key}>{question.description}</p>;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {interviewDetails.interview.status == "Planned" ||
        interviewDetails.interview.status == "In progress" ? (
          <Button variant="primary" onClick={startInterview}>
            {interviewDetails.interview.status == "Planned" ? 'Start interview' : 'Join interview'}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default InterviewModal;
