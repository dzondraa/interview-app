import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import { useEffect, useState } from "react";
import schema from "../../config/entitySchemas/candidates";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import ErrorBox from "../../components/common/ErrorBox/ErrorBox";

const CandidatesPage = () => {
  const api = Api.getAuthServiceInstance();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, changeLoading] = useState(true);

  useEffect(async () => {
    try {
      changeLoading(true);
      var data = await api.get("users");
      setData(data);
      changeLoading(false);
    } catch (ex) {
      console.error(ex);
      setErrors((e) => [{ message: ex.message }]);
      changeLoading(false);
    }
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
            {isLoading && <LoaderSpin></LoaderSpin>}
            {errors.length > 0 && <ErrorBox errors={errors}></ErrorBox>}
            {data != null && (
              <DynamicTable
                props={{
                  data: data.data,
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
