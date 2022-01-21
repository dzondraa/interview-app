import { useEffect, useState } from "react";
import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import "./ReviewedCVs.css";

const Questions = () => {
  const [documents, setDocuments] = useState(null);
  const api = new Api();

  useEffect(() => {
    api.get("documents").then((res) => console.log(res));
  });

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div className="col-lg-6">
          <h1
            style={{
              marginTop: "15px",
              textAlign: "center"
            }}
          >
            Reviewed CV Documents
          </h1>
          {documents ? <DynamicTable prop={documents}></DynamicTable> : <LoaderSpin></LoaderSpin>}
        </div>
      </div>
    </div>
  );
};

export default Questions;
