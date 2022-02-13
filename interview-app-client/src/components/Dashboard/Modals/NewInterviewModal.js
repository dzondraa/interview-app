import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiFactory from "../../../services/Service";
import Area from "../../Areas/Area";
import "./NewInterviewModal.css";
import NewInterviewForm from "../../Interview/NewInterviewForm";

const NewInterviewModal = ({ modalOpen, handleClose }) => {
  const api = ApiFactory.getResourceApiInstance();
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    api
      .get("area")
      .then((areas) => setAreas(areas))
      .catch((er) => console.log(er.message));
  }, []);

  useEffect(() => {}, []);

  const createNewInterview = () => {
    // chose candidates
    // add list of questions
  };
  return (
    <Modal show={modalOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Interview details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Area area={areas}></Area>
        <div className="form-container col-lg-6">
          <NewInterviewForm />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewInterview}>
          Create New Interview
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewInterviewModal;
