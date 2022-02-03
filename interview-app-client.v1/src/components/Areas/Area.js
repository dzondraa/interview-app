import { useState } from "react";
import { Collapse } from "react-bootstrap";
import "./Area.css";
import AddNewArea from "./Partial/AddNewArea";

const Area = ({ area, areas }) => {
  const buildAreasDOM = (areas) => {
    return areas.map((area, key) => {
      return <Area area={area} key={key} areas={areas} />;
    });
  };

  const [open, setOpen] = useState(false);
  const subareaCount = area.subareas.length;
  const [subareas, setSubareas] = useState(buildAreasDOM(area.subareas));

  return (
    <div className="card" style={{ width: "18rem" }}>
      <ul className="list-group list-group-flush bear-list">
        <li
          style={{ cursor: "pointer" }}
          className={`list-group-item subarea`}
        >
          <span
            className="bear-span"
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            {area.name}
            {subareaCount ? `(${subareaCount})` : null}
          </span>
        </li>
        <Collapse in={open}>
          <div id="example-collapse-text">
            {subareas}
            {subareaCount > 0 ? <AddNewArea setSubareas={setSubareas} buildAreasDOM={buildAreasDOM} area={area} /> : null}
          </div>
        </Collapse>
      </ul>
    </div>
  );
};

export default Area;
