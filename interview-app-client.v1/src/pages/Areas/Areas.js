import { useEffect, useState } from "react";
import Area from "../../components/Areas/Area";
import AddNewArea from "../../components/Areas/Partial/AddNewArea";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";

const Areas = () => {
  const initAreas = [
    {
      id: 1,
      name: "C#",
      subareas: [
        {
          id: 12,
          name: "ASP.NET",
          subareas: [
            {
              id: 121,
              name: "API",
              subareas: [],
            },
            {
              id: 122,
              name: "MVC",
              subareas: [],
            },
          ],
        },
        {
          id: 13,
          name: "Xamarin",
          subareas: [],
        },
      ],
    },
    {
      id: 2,
      name: "Java",
      subareas: [
        {
          id: 21,
          name: "Maven",
          subareas: [],
        },
        {
          id: 22,
          name: "Mobile",
          subareas: [],
        },
        {
          id: 23,
          name: "Web",
          subareas: [],
        },
      ],
    },
  ];
  const [areas, setAreas] = useState(initAreas);

  useEffect(() => {
    // Update the document title using the browser API
  }, [areas]);

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
            <AddNewArea areaId={0} areas={areas} setAreas={setAreas} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
