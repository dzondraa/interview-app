import { useEffect, useState } from "react";
import Area from "../../components/Areas/Area";
import AddNewArea from "../../components/Areas/Partial/AddNewArea";
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
    await api.post("area/batchdelete", selectedAreas);
    // TODO Avoid non-necessary GET call
    const areas = await api.get("area");
    setAreas((a) => (a = areas));
  };

  useEffect(async () => {
    try {
      const response = await api.get("area");
      setAreas(response);
    } catch (er) {
      console.error(er);
      setError(er.message);
    }
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
              {areas.length != 0 && (
                <Area area={areas} checkChange={checkChange}></Area>
              )}
              {error && <ErrorBox errors={[{ message: error }]} />}
              {areas.length != 0 || error ? null : <LoaderSpin />}
            </div>
            <div className="col-lg-6">
              <button
                style={{
                  width: "150px",
                }}
                onClick={deleteAreas}
                type="button"
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
