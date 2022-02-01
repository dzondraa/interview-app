import { useState } from "react";

const AddNewArea = () => {
  const hadnleAddNewClick = () => {
    setAddingNew((an) => (an = true));
  };
  const handleClickOutside = (e) => {
    !e.target.classList.contains("newAreaInput") &&
      setAddingNew((an) => (an = false));
  };
  const [addingNew, setAddingNew] = useState(false);
  document.addEventListener("mousedown", handleClickOutside);

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
          <input className="newAreaInput" type="text" />
        ) : (
          <span className="bear-span">Add new</span>
        )}
      </li>
    </div>
  );
};

export default AddNewArea;
