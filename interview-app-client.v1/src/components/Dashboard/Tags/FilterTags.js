import { useState } from "react";

const FilterTags = ({ tags }) => {
  //   const tags = ["java", "C#", "Docker"];
  return (
    <div style={{
        padding: '15px',
        border: '1px solid lightblue',
        width: 'auto'
    }}>
      {tags.map((tag, key) => (
        <button key={key} type="button" className="btn btn-info">
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
