import { useEffect, useState } from "react";
import Area from "../../components/Areas/Area";
import NewQuestionForm from "../../components/Areas/Partial/NewQuestionFrom";
import ErrorBox from "../../components/common/ErrorBox/ErrorBox";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";

const Areas = () => {
  const api = Api.getResourceApiInstance();
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const checkChange = (e) => {
    var selectedArrState = selectedAreas;
    e.target.checked
      ? selectedArrState.push(e.target.value)
      : selectedArrState.indexOf(e.target.value) > -1 &&
        selectedArrState.splice(selectedArrState.indexOf(e.target.value), 1);

    setSelectedAreas((s) => (s = selectedArrState));
  };

  const deleteAreas = async () => {
    try {
      await api.post("area/batchdelete", selectedAreas);
      // TODO Avoid non-necessary GET call
      const areas = await api.get("area");
      setAreas((a) => (a = areas));
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    api
      .get("area", null, ac.signal)
      .then((areas) => setAreas(areas))
      .catch((er) => setError(er.message));

    return () => {
      ac.abort();
    };
  }, []);

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div id="areas-container" className="col-lg-10">
          <div className="row">
            <h1
              style={{
                marginTop: "15px",
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              Areas and fields
            </h1>
            <div className="col-lg-4">
              <h3>Technical fields</h3>
              <button
                style={{
                  width: "100px",
                  marginLeft: "5px",
                }}
                onClick={deleteAreas}
                type="button"
                className="btn btn-danger"
              >
                Delete
              </button>
              {areas.length != 0 && (
                <Area area={areas} checkChange={checkChange}></Area>
              )}
              {error && <ErrorBox errors={[{ message: error }]} />}
              {areas.length != 0 || error ? null : <LoaderSpin />}
            </div>
            <div className="col-lg-6">
              <h3>Add new question to selected areas</h3>
              <NewQuestionForm selectedAreas={selectedAreas} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
