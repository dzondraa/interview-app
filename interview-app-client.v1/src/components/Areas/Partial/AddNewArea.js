import { useState } from "react";

const AddNewArea = ({ areas, setAreas, areaId }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [area, setArea] = useState(null);

  const hadnleAddNewClick = () => {
    setAddingNew((an) => (an = true));
  };
  const handleClickOutside = (e) => {
    !e.target.classList.contains("newAreaInput") &&
      setAddingNew((an) => (an = false));
  };
  document.addEventListener("mousedown", handleClickOutside);

  const handleEnter = (e) => {
    e.code == "Enter" && addNewSubarea(areaId, e.target.value);
  };

  const addNewSubarea = async (areaId, name) => {
    const insertionArea = {
      id: 12414,
      name: name,
      subareas: [],
    };

    if (areaId === 0) {
      areas.push(insertionArea);
      setAreas((a) => (a = areas));
    } else {
      await setToAreaWithId(122, areas);
      console.log("SET TO: ", area);
    }
  };

  const setToAreaWithId = (id, areas) => {
    areas.forEach((area) => {
      getById(id, area);
    });
  };
  const getById = (id, area) => {
    //   console.log(areas);
    if (area.id == id) setArea((e) => (e = area));
    else
      area.subareas.forEach((subarea) => {
        return getById(id, subarea);
      });
  };
  return (
    <div
      onClick={hadnleAddNewClick}
      style={{
        border: "0px solid red",
      }}
      className="card add-new"
      style={{ width: "18rem" }}
    >
      <li
        style={{
          border: "none",
          backgroundColor: "gainsboro",
          color: "steelblue",
          cursor: "pointer",
        }}
        className="list-group-item"
      >
        {addingNew ? (
          <input onKeyDown={handleEnter} className="newAreaInput" type="text" />
        ) : (
          <span className="bear-span">Add new</span>
        )}
      </li>
    </div>
  );
};

export default AddNewArea;
