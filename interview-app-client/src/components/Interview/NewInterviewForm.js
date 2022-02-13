import { useState } from "react";
import { Button } from "react-bootstrap";
import ApiFactory from "../../services/Service";
const NewInterviewForm = ({ questions }) => {
  const [areaInput, setAreaInput] = useState({
    candidate: null,
    questions: null,
    date: null,
    time: null,
  });
  const prepareDataForRequest = () => {
    var questioSelection = Array.from(areaInput.questions);
    var questionsList = [];
    questioSelection.forEach((q) => {
      questionsList.push(q.value);
    });
    var newInterviewData = {
      // TODO -> Suggestions for user (serach by email)
      candidateId: areaInput.candidate,
      questions: questionsList,
      date: `${areaInput.date}T${areaInput.time}:40.233+00:00`,
    };
    console.log(newInterviewData);
    return newInterviewData;
  };

  const createNewInterview = async () => {
    try {
      await ApiFactory.getResourceApiInstance().post(
        "interview",
        prepareDataForRequest()
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="exampleFormControlInput1">Candidate</label>
        <input
          onChange={(e) =>
            setAreaInput(
              (value) => (value = { ...value, candidate: e.target.value })
            )
          }
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Candidate email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleFormControlSelect2">
          Select questions for the
        </label>
        <select
          onChange={(e) => {
            setAreaInput(
              (value) =>
                (value = { ...value, questions: e.target.selectedOptions })
            );
          }}
          multiple
          className="form-control"
          id="exampleFormControlSelect2"
        >
          {questions.map((question, key) => (
            <option title={question.description} key={key} value={question.id}>
              {question.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          onChange={(e) =>
            setAreaInput(
              (value) => (value = { ...value, date: e.target.value })
            )
          }
          type="date"
          className="form-control"
          id="date"
          placeholder="Date"
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Time</label>
        <input
          onChange={(e) =>
            setAreaInput(
              (value) => (value = { ...value, time: e.target.value })
            )
          }
          type="time"
          className="form-control"
          id="time"
          placeholder="Time"
        />
      </div>
      <Button variant="primary" onClick={createNewInterview}>
        Create New Interview
      </Button>
    </form>
  );
};

export default NewInterviewForm;
