import { useState } from "react";
import { Collapse } from "react-bootstrap";
import "./Area.css";
import AddNewArea from "./Partial/AddNewArea";

const Area = ({ area }) => {
  const [open, setOpen] = useState(false);
  const subareaCount = area.subareas.length;

  return (
    <div className="card" style={{ width: "18rem" }}>
      <ul className="list-group list-group-flush bear-list">
        <li
          style={{ cursor: "pointer" }}
          className={`list-group-item ${subareaCount ? "subarea" : ""}`}
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
            {area.subareas.map((subarea, key) => {
              return <Area key={key} id={area.name} area={subarea}></Area>;
            })}
            {subareaCount > 0 ? (
              <AddNewArea areaId={0} />
            ) : null}
          </div>
        </Collapse>
      </ul>
    </div>
  );
};

export default Area;
