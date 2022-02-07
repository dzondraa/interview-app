import { useEffect, useState } from "react";
import ErrorBox from "../../common/ErrorBox/ErrorBox";
import validator from "validator";
import ApiFactory from "../../../services/Service";
import SuccessBox from "../../common/SuccessBox/SuccessBox";

const NewQuestionForm = ({ selectedAreas }) => {
  const api = ApiFactory.getResourceApiInstance();
  const Complexity = {
    Low: 1,
    LowToMid: 2,
    Mid: 3,
    MidToHigh: 4,
    High: 5,
    VeryHigh: 6,
  };
  const [name, setName] = useState("");
  const [complexity, setComplexity] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);

  const handleSuccess = () => {
    document.getElementById('questionForm').reset()
    setSuccessMessages([{ message: "Sucessfully created question!" }]);
    setTimeout(() => {
      setSuccessMessages([]);
    }, 5000);
  };

  const addNewArea = async () => {
    const isValid = validate();
    if (isValid) {
      try {
        const response = await api.post("question", {
          name: name,
          complexity: complexity,
          description: description,
          areas: selectedAreas,
        });
        if (response) handleSuccess();
      } catch (ex) {
        console.error(ex);
        setErrors((e) => (e = { message: ex.message }));
      }
    }
  };
  const validate = () => {
    var errList = [];
    validator.isEmpty(name) && errList.push({ message: "Name is required" });
    validator.isEmpty(description) &&
      errList.push({ message: "Description is required" });
    complexity <= 0 && errList.push({ message: "Select a complexity" });
    setErrors(errList);
    return !errList.length > 0;
  };

  return (
    <form id="questionForm">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          onChange={(e) => setName((name) => (name = e.target.value))}
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter question name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleFormControlSelect1">Complexity</label>
        <select
          onChange={(e) => setComplexity((c) => (c = e.target.selectedIndex))}
          className="form-control"
          id="Complexity"
        >
          <option value={0}>Select</option>
          {/* show all the complexity */}
          {Object.keys(Complexity).map((keyName, i) => (
            <option key={i} value={Complexity[keyName]}>
              {keyName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="Description">Description</label>
        <textarea
          className="form-control"
          id="Description"
          rows="3"
          onChange={(e) => setDescription((desc) => (desc = e.target.value))}
          placeholder="Question description"
        ></textarea>
      </div>
      <button
        style={{ backgroundColor: "#4e73df" }}
        id="save"
        type="button"
        className="btn btn-primary btn-lg btn-block"
        onClick={addNewArea}
      >
        Save
      </button>
      {errors.length > 0 && <ErrorBox errors={errors} />}
      {successMessages.length > 0 && <SuccessBox messages={successMessages} />}
    </form>
  );
};

export default NewQuestionForm;
