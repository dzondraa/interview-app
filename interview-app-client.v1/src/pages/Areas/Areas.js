import { useEffect, useState } from "react";
import Area from "../../components/Areas/Area";
import AddNewArea from "../../components/Areas/Partial/AddNewArea";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";

const Areas = () => {
  const api = Api.getResourceApiInstance();
  const [areas, setAreas] = useState([]);

  useEffect(async () => {
    const response = await api.get("area");
    setAreas(response);
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
            {areas.length == 0 ? null : (
              <Area id={areas.name} area={areas}></Area>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
