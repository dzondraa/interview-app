const FilterTags = ({ tags, deleteTag }) => {
  return (
    <div
      style={{
        padding: "15px",
        display: "flex",
        width: "auto",
        minHeight: "70px",
      }}
    >
      <span
        style={{
          fontSize: "15x",
        }}
      >
        Skills filters:
      </span>
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
