import { useEffect, useState } from "react";
import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import SearchDocForm from "../../components/Dashboard/SearchDocForm";
import "./ReviewedCVs.css";
import schema from '../../config/entitySchemas/documents'
;


const Questions = () => {
  const [documents, setDocuments] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div className="col-lg-6">
          <h1
            style={{
              marginTop: "15px",
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            Reviewed CV Documents
          </h1>
          <SearchDocForm
            parentServices={{
              setIsSearching: setIsSearching,
              setDocuments: setDocuments,
            }}
          />
          {isSearching ? <LoaderSpin></LoaderSpin> : null}
          {documents && !isSearching ? <DynamicTable props={{schema: schema, data: documents}}></DynamicTable> : null}
        </div>
      </div>
    </div>
  );
};

export default Questions;
