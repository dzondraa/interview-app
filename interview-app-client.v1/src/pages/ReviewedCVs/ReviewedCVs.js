import { useEffect, useState } from "react";
import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import SearchDocForm from "../../components/Dashboard/SearchDocForm";
import "./ReviewedCVs.css";
import schema from "../../config/entitySchemas/documents";
import searchingGif from "../../assets/images/searchingGif.gif";
import whatYouLookingForImg from "../../assets/images/whatyoulookingfor.png";

const Questions = () => {
  const [documents, setDocuments] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div
          className="col-lg-10"
          style={{
            textAlign: "center",
          }}
        >
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
          {isSearching ? (
            <img alt="Searching your documents..." src={searchingGif} />
          ) : null}
          {documents && !isSearching && (
            <DynamicTable
              props={{ schema: schema, data: documents }}
            ></DynamicTable>
          )}

          {!documents && !isSearching ? (
            <div>
              <h2
                style={{
                  marginTop: "20px",
                }}
              >
                Let us know.. <br></br> What are you looking for?
              </h2>
              <img
                src={whatYouLookingForImg}
                alt="what you looking for"
                height="500px"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Questions;
