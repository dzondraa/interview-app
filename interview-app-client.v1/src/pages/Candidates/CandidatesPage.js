import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import { useEffect, useState } from "react";
import schema from "../../config/entitySchemas/candidates";

const CandidatesPage = () => {
  const api = Api.getAuthServiceInstance();
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("users").then((u) => setData(u.data));
  }, []);
  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div className="col-lg-10">
          <h1
            style={{
              marginTop: "15px",
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            Candidates
          </h1>
          <div className="col-lg-10">
            {data != null && (
              <DynamicTable
                props={{
                  data: data,
                  schema: schema,
                }}
              ></DynamicTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
