import DynamicTable from "../../components/common/DynamicTable/DynamicTable";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from "../../services/Service";
import { useEffect, useState } from "react";
import schema from "../../config/entitySchemas/interview";
import schemaCandidate from "../../config/entitySchemas/interviewCandidate";
import LoaderSpin from "../../components/common/Loaders/LoaderSpin";
import ErrorBox from "../../components/common/ErrorBox/ErrorBox";
import FilterTags from "../../components/Dashboard/Tags/FilterTags";
import InterviewModal from "../../components/Dashboard/Modals/InterviewModal";
import useToken from "../../hooks/useToken";

const InterviewPage = () => {
  const api = Api.getResourceApiInstance();
  const tokenService = useToken();
  const user = tokenService.getLoggedInUser();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, changeLoading] = useState(true);
  const [tags, setFilterTags] = useState([]);
  const [status, setStatus] = useState("0");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterview, seSelectedInterview] = useState(null);

  useEffect(() => {
    user.role == "interviewer" ? getData(tags, status) : getCandidateData();
  }, [tags, status]);

  const getCandidateData = async () => {
    try {
      changeLoading(true);
      const data = await api.get(
        `interview?candidate=${user.user.profileObj.email}`,
        null
      );
      setData(data);
    } catch (ex) {
      setErrors([ex]);
    } finally {
      changeLoading((l) => (l = false));
    }
  };
  const getData = async () => {
    changeLoading(true);
    const uri = buildUri();
    try {
      const data = await api.get(uri, null);
      setData(ensurePrettyData(data));
    } catch (ex) {
      setErrors([ex]);
    } finally {
      changeLoading((l) => (l = false));
    }
  };

  const handleShow = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const buildUri = () => {
    var uri = "interview?";
    if (tags.length > 0) {
      var str = "";
      tags.forEach((f) => {
        str += `areas=${f}&`;
      });
      uri += str;
    }
    if (status !== "0") uri += `status=${status}`;

    return uri;
  };
  const ensurePrettyData = (response) => {
    response.data.forEach((element) => {
      element.skills = skillsToTagDisplay(element.skills);
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
  const changeStatus = (event) => {
    if (status !== event.target.value.toString()) setStatus(event.target.value);
  };
  const addTag = (event) => {
    var tag = event.target.value;
    var tagsReplica = [...tags];
    if (tagsReplica.filter((t) => t === tag).length === 0) {
      tagsReplica.push(tag);
      setFilterTags((t) => (t = tagsReplica));
    }
  };
  const deleteTag = (event) => {
    var tag = event.target.value;
    var tagsReplica = [...tags];
    const indexToDelete = tagsReplica.indexOf(tag);
    if (indexToDelete > -1) {
      tagsReplica.splice(indexToDelete, 1);
      setFilterTags((tags) => (tags = tagsReplica));
    }
  };
  const handleRowClick = (e) => {
    const interviewId = e.target.closest(".table-row").getAttribute("data");
    if (e.target.nodeName == "BUTTON") return;
    seSelectedInterview(interviewId);
    handleShow();
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
            <div className="row">
              <div className="col-lg-3">
                <select
                  onClick={changeStatus}
                  className="form-select form-select mb-3"
                  aria-label=".form-select-lg example"
                >
                  <option defaultValue value="0">
                    Filter by status
                  </option>
                  <option>Planned</option>
                  <option>Canceled</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            {modalOpen && (
              <InterviewModal
                modalOpen={modalOpen}
                handleShow={handleShow}
                handleClose={handleClose}
                selectedInterview={selectedInterview}
              ></InterviewModal>
            )}
            <FilterTags tags={tags} deleteTag={deleteTag}></FilterTags>
            {isLoading && <LoaderSpin></LoaderSpin>}
            {errors.length > 0 && <ErrorBox errors={errors}></ErrorBox>}
            {data != null && !isLoading && (
              <DynamicTable
                props={{
                  data: data.data,
                  schema: user.role == "interviewer" ? schema : schemaCandidate,
                  handleRowClick,
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