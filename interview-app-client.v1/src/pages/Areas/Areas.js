import Sidebar from "../../components/Partials/Sidebar/Sidebar";

const Areas = () => {
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
            Areas and fields
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Areas;
