import { useEffect, useState } from "react";
import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import "./ReviewedCVs.css";
import config from "../../config/config"

const Questions = () => {
  const [documents, setDocuments] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [wordCount, setWordCount] = useState(null);
  const api = Api.getResourceApiInstance();

  useEffect(() => {}, []);

  const submitButton = () => {
    api
      .get(
        `?path=${config.FILE_REPOSITORY}&targetMatch=${wordCount}&keyword=${keyword}`
      )
      .then((res) => {
        console.log(res);
        setDocuments(res);
      });
  };

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
          <form className="form-inline">
            <div className="form-group mb-2">
              <label htmlFor="staticEmail2" className="sr-only">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="staticEmail2"
                placeholder="Keyword"
                onChange={(e) => {
                  setKeyword((kw) => (kw = e.target.value));
                }}
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <label htmlFor="inputPassword2" className="sr-only">
                Password
              </label>
              <input
                type="number"
                className="form-control"
                id="inputPassword2"
                placeholder="Word count"
                onChange={(e) => {
                  setWordCount((wc) => (wc = e.target.value));
                }}
              />
            </div>
            <button
              onClick={submitButton}
              type="button"
              className="btn btn-primary mb-2"
            >
              Scrape!
            </button>
          </form>
          {documents ? (
            <DynamicTable props={documents}></DynamicTable>
          ) : (
            <LoaderSpin></LoaderSpin>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
