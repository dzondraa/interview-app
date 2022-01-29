import Area from "../../components/Areas/Area";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";

const Areas = () => {
  const areas = [
    {
      name: "C#",
      subareas: [
        {
          name: "ASP.NET",
          subareas: [
            {
              name: "API",
              subareas: [],
            },
            {
              name: "MVC",
              subareas: [],
            },
          ],
        },
        {
          name: "Xamarin",
          subareas: [],
        },
      ],
    },
    {
      name: "Java",
      subareas: [
        {
          name: "Maven",
          subareas: [],
        },
        {
          name: "Mobile",
          subareas: [],
        },
        {
          name: "Web",
          subareas: [],
        },
      ],
    },
  ];
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
          <div className="col-lg-6">
            {areas.map((area, key) => {
              return <Area area={area} key={key} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
