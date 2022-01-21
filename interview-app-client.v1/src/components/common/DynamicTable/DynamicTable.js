const DynamicTable = (props) => {
  const schema = {
    properties: ["File name", "Matches", "Relevancy scale"],
  };

  function nameFromPath(path) {
    return path.split("\\").pop();
  }

  function extractRelevancy(path) {
      return path.split("|").pop().trim()
  }
  return (
    <div
      style={{
        overflow: "auto",
        height: "700px",
      }}
    >
      <table className="table table-hover smart-bear-dyntable">
        <thead>
          <tr>
            <th scope="col">#</th>
            {schema.properties.map((prop, index) => {
              return <th key={index}>{prop}</th>;
            })}
          </tr>
        </thead>
        {/* <iframe
          src="https://view.officeapps.live.com/op/embed.aspx?src=https://docs.google.com/document/d/1SLim5l5ckXI6u6bu2B6PWsR0zsAoCLqT5foANxEUWT8"
          width="80%"
          height="565px"
          frameborder="0"
        >
        </iframe> */}
        <tbody>
          {props.props.map((prop, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index}</th>
                <td>
                  <p>{nameFromPath(prop)}</p>
                </td>
                <td>
                  <p>{extractRelevancy(prop)}</p>
                </td>
                <td><progress id="file" value={Math.floor(Math.random() * 11)} max="10"> 32% </progress></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
