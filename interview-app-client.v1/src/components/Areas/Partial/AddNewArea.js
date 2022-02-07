import { useState } from "react";
import Api from "../../../services/Service";

const AddNewArea = ({ area, setSubareas, buildAreasDOM }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [thisArea, setThisArea] = useState(area);
  const api = Api.getResourceApiInstance();
  console.log(area);
  // Handle events for toggle input field
  const hadnleAddNewClick = () => {
    setAddingNew((an) => (an = true));
  };
  const handleClickOutside = (e) => {
    !e.target.classList.contains("newAreaInput") &&
      setAddingNew((an) => (an = false));
  };
  document.addEventListener("mousedown", handleClickOutside);

  // Do insert on 'Enter' key
  const handleEnter = (e) => {
    e.code == "Enter" && addNewSubarea(e.target.value);
  };

  const addNewSubarea = async (name) => {
    // retrieve current state
    var areaState = thisArea;
    const insertedArea = await api.post("Area", {
      name: name,
      parent: area.id,
    });
    insertedArea.subareas = [];
    // patch areas
    areaState.subareas.push(insertedArea);
    // build dom
    const dom = buildAreasDOM(areaState.subareas);
    // change state
    setSubareas((sub) => (sub = dom));
    // change UI
    setAddingNew((an) => (an = false));
  };

  return (
    <div
      onClick={hadnleAddNewClick}
      className="card add-new"
      style={{ width: "18rem", border: 0, marginLeft: "5px", width: "284px" }}
    >
      <li
        style={{
          border: "none",
          backgroundColor: "gainsboro",
          color: "steelblue",
          cursor: "pointer",
          marginLeft: "5px !important",
          marginTop: "5px",
          fontWeight: "bold",
        }}
        className="list-group-item"
      >
        {addingNew ? (
          <input
            autoFocus={true}
            id="newArea"
            onKeyDown={handleEnter}
            className="newAreaInput form-control"
            type="text"
            placeholder="New area name"
            style={{
              height: "25px",
            }}
          />
        ) : (
          <span className="bear-span">Add new</span>
        )}
      </li>
    </div>
  );
};

export default AddNewArea;
