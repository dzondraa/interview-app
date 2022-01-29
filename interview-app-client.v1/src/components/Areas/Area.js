import { useState } from "react";
import { Collapse, Button } from "react-bootstrap";
import "./Area.css";

const Area = ({ area }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card" style={{ width: "18rem" }}>
      <ul className="list-group list-group-flush">
        <li
          style={{ cursor: "pointer" }}
          className={`list-group-item ${area.subareas.length ? "subarea" : ""}`}
        >
          <span
            className="bear-span"
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            {area.name}
            {area.subareas.length ? `(${area.subareas.length})` : null}
          </span>
        </li>
        <Collapse in={open}>
          <div id="example-collapse-text">
            {area.subareas.map((subarea, key) => {
              return <Area key={key} id={area.name} area={subarea}></Area>;
            })}
          </div>
        </Collapse>
      </ul>
    </div>
  );
};

export default Area;
