import { useState } from "react";

const FilterTags = ({ tags }) => {
  //   const tags = ["java", "C#", "Docker"];
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
