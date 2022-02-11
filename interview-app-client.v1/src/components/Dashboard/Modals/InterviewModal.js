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
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    api
      .get("interview", selectedInterview)
      .then((res) => setInterview(res[0]))
      .catch((ex) => console.log(ex));
  }, []);
  return interview ? (
    <Modal show={modalOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Interview details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Date</b> {new Date(interview.interview.date).toDateString()}
        <br />
        <b>Time</b> {new Date(interview.interview.date).toTimeString()}
        <br></br>
        <b>Questions:</b>
        {interview.questions.map((question, key) => {
          return <p key={key}>{question.description}</p>;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {interview.interview.status == "Planned" && (
          <Button variant="primary" onClick={handleClose}>
            Start interview
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default InterviewModal;
