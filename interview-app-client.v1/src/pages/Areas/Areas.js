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
    console.log(selectedArrState);
    e.target.checked
      ? selectedArrState.push(e.target.value)
      : selectedArrState.indexOf(e.target.value) > -1 &&
        selectedArrState.splice(selectedArrState.indexOf(e.target.value), 1);

    setSelectedAreas((s) => (s = selectedArrState));
    console.log(selectedAreas);
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
          <h1
            style={{
              marginTop: "15px",
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            Areas and fields
          </h1>
          <div className="col-lg-6">
            {areas.length != 0 && <Area area={areas} checkChange={checkChange}></Area>}
            {error && <ErrorBox errors={[{ message: error }]} />}
          </div>
          {areas.length != 0 || error ? null : <LoaderSpin />}
        </div>
      </div>
    </div>
  );
};

export default Areas;
