import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import { useEffect, useState } from "react";
import schema from "../../config/entitySchemas/interview";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import ErrorBox from "../../components/common/ErrorBox/ErrorBox";
import FilterTags from "../../components/Dashboard/Tags/FilterTags";

const InterviewPage = () => {
  const api = Api.getAuthServiceInstance();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, changeLoading] = useState(true);
  const [tags, setFilterTags] = useState([]);

  useEffect(() => {
    // setTimeout(() => {
    //   addTag(".NET");
    // }, 3000);
    api
      .get("interview", null)
      .then((response) => ensurePrettyData(response))
      .then((data) => setData(data))
      .then((r) => changeLoading((l) => (l = false)))
      .catch((er) => setErrors([er]));
  }, [tags]);

  const ensurePrettyData = (response) => {
    response.data.forEach((element) => {
      element.skills = skillsToTagDisplay(["NET", "C#"]);
    });
    return response;
  };

  const skillsToTagDisplay = (skills) => {
    return skills.map((skill, key) => {
      return (
        <button
          style={{
            margin: "5px",
          }}
          value={skill}
          onClick={addTag}
          className="btn btn-info"
          key={key}
        >
          {skill}
        </button>
      );
    });
  };

  const addTag = (event) => {
    var tag = event.target.value;
    if (tags.filter((t) => t == tag).length == 0)
    setFilterTags((tags) => tags.concat([tag]));
  };

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
            Interviews
          </h1>
          <div className="col-lg-10">
            <FilterTags tags={tags}></FilterTags>
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

export default InterviewPage;
