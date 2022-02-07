import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import "./Area.css";
import AddNewArea from "./Partial/AddNewArea";

const Area = ({ area, areas, checkChange }) => {
  const buildAreasDOM = (areas) => {
    return areas.map((area, key) => {
      return <Area area={area} key={key} checkChange={checkChange} areas={areas} />;
    });
  };

  const [open, setOpen] = useState(false);
  const subareaCount = area.subareas.length;
  const [subareas, setSubareas] = useState(buildAreasDOM(area.subareas));

  const toggleArea = (e) => {
    setOpen(!open);
  };

  var collapsiveArrow = open ? (
    <FontAwesomeIcon
      icon={faCaretDown}
      style={{
        marginTop: "5px",
        float: "right",
      }}
    />
  ) : (
    <FontAwesomeIcon
      icon={faCaretRight}
      style={{
        marginTop: "5px",
        float: "right",
      }}
    />
  );

  return (
    <div className="card my-crd" style={{ width: "18rem" }}>
      <ul className="list-group list-group-flush bear-list">
        <li
          style={{ cursor: "pointer" }}
          className={`list-group-item subarea ${area.name} ${open}`}
        >
          <span
            className="bear-span"
            onClick={toggleArea}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            {area.name}
            {subareaCount > 0 ? ` (${subareaCount})` : null}
          </span>
          {subareaCount ? collapsiveArrow : null}
          <input
            style={{ float: "left" }}
            className="form-check-input"
            type="checkbox"
            value={area.id}
            id={area.name}
            onChange={checkChange}
          />
        </li>
        <Collapse in={open}>
          <div style={{ border: 0 }} id="example-collapse-text">
            {subareas}
            {subareaCount > 0 ? (
              <AddNewArea
                setSubareas={setSubareas}
                buildAreasDOM={buildAreasDOM}
                area={area}
              />
            ) : null}
          </div>
        </Collapse>
      </ul>
    </div>
  );
};

export default Area;
