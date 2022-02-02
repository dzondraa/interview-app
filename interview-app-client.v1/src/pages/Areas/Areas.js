import { useEffect, useState } from "react";
import Area from "../../components/Areas/Area";
import AddNewArea from "../../components/Areas/Partial/AddNewArea";
import Sidebar from "../../components/Partials/Sidebar/Sidebar";

const Areas = () => {
  var areasFromDB = [
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
  const buildAreasDOM = (areas) => {
    var res = areas.map((area, key) => {
      return <Area area={area} key={key} />;
    });
    console.log(res);
    return res;
  };

  const addNewAreaDOM = (areaToAdd) => {
    areasFromDB.push(areaToAdd);
    console.log(areas);
    setAreas((a) => (a = buildAreasDOM(areasFromDB)));
  };

  const [areas, setAreas] = useState(buildAreasDOM(areasFromDB));

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
        <div id="areas-container" className="col-lg-6">
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
            {areas}
            <AddNewArea areaId={0} areas={areas} addNewAreaDOM={addNewAreaDOM} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
