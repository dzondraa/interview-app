import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiFactory from "../../../services/Service";
import Area from "../../Areas/Area";
import "./NewInterviewModal.css";
import NewInterviewForm from "../../Interview/NewInterviewForm";

const NewInterviewModal = ({ modalOpen, handleClose }) => {
  const api = ApiFactory.getResourceApiInstance();
  const [areas, setAreas] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const updateAreas = (e) => {
    var selectedArrState = selectedAreas;
    e.target.checked
      ? selectedArrState.push(e.target.value)
      : selectedArrState.indexOf(e.target.value) > -1 &&
        selectedArrState.splice(selectedArrState.indexOf(e.target.value), 1);
    setSelectedAreas((s) => (s = selectedArrState));
  };
  const checkChange = async (e) => {
    updateAreas(e);
    try {
      const questionsResponse = await api.get("question" + buildUrlParams());
      setQuestions(questionsResponse);
    } catch (ex) {
      console.error(ex);
    }
  };

  const buildUrlParams = () => {
    if (selectedAreas.length === 0) return "";
    var str = "?";
    selectedAreas.forEach((area) => {
      str += `area=${area}&`;
    });
    return str;
  };
  useEffect(() => {
    const getAreas = async () => {
      try {
        const areasResponse = await api.get("area");
        setAreas(areasResponse);
      } catch (ex) {
        console.error(ex);
      }
    };
    getAreas();
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
        <Area checkChange={checkChange} area={areas}></Area>
        <div className="form-container col-lg-7">
          <NewInterviewForm questions={questions} />
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
