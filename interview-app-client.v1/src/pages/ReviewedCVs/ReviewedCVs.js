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
    api.get("documents?path=C:\\Users\\v-dnikolic\\Desktop\\Private\\ReviewedCVs&targetMatch=8&keyword=Java", ).then((res) =>{
    console.log(res);
    setDocuments(res)
  })
  }, []);

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div className="col-lg-6">
          <h1
            style={{
              marginTop: "15px",
              textAlign: "center",
              marginBottom: '25px'
            }}
          >
            Reviewed CV Documents
          </h1>
          {documents ? <DynamicTable props={documents}></DynamicTable> : <LoaderSpin></LoaderSpin>}
        </div>
      </div>
    </div>
  );
};

export default Questions;
