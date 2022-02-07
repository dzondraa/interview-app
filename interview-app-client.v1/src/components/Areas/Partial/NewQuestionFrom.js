const NewQuestionForm = () => {
  const Complexity = {
    Low: 1,
    LowToMid: 2,
    Mid: 3,
    MidToHigh: 4,
    High: 5,
    VeryHigh: 6,
  };

  console.log(Complexity.High);
  return (
    <form>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter question name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleFormControlSelect1">Complexity</label>
        <select className="form-control" id="Complexity">
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
          placeholder="Question description"
        ></textarea>
      </div>
      <button style={{backgroundColor: '#4e73df'}} id="save" type="button" class="btn btn-primary btn-lg btn-block">
        Save
      </button>
    </form>
  );
};

export default NewQuestionForm;
