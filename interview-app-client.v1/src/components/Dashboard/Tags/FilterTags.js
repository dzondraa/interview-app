import { useState } from "react";

const FilterTags = ({ tags, deleteTag }) => {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid lightblue",
        display: "flex",
        width: "auto",
      }}
    >
      {tags.map((tag, key) => (
        <button
          onClick={deleteTag}
          value={tag}
          style={{ marginLeft: "5px" }}
          key={key}
          type="button"
          className="btn btn-info"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
