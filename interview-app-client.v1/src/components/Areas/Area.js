import { useState } from "react";

const Area = ({ area }) => {
  const [showSubareas, setShowSubareas] = useState();
  return (
    <div className="card" style={{ width: "18rem" }}>
      <ul className="list-group list-group-flush">
        <li
          style={{ cursor: "pointer", marginLeft: '10px' }}
          className="list-group-item"
          onClick={(e) => setShowSubareas((show) => (show = !showSubareas))}
        >
          {area.subareas.length ? <b>{area.name}</b> : area.name}
        </li>
        {showSubareas
          ? area.subareas.map((subarea, key) => {
              return <Area area={subarea} key={key}></Area>;
            })
          : null}
      </ul>
    </div>
  );
};

export default Area;
