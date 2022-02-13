const NewInterviewForm = ({ questions }) => {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="exampleFormControlInput1">Candidate</label>
        <input
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
          type="date"
          className="form-control"
          id="date"
          placeholder="Date"
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Example textarea</label>
        <input
          type="time"
          className="form-control"
          id="time"
          placeholder="Time"
        />
      </div>
    </form>
  );
};

export default NewInterviewForm;
