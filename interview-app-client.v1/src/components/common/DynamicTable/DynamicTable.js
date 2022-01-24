const DynamicTable = (props) => {
  const schema = {
    properties: ["path", "relevancy"],
  };

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
          {props.props.data.map((prop, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index}</th>
                { schema.properties.map((propertyName, propertyIndex) => {
                  console.log(prop);
                  return (
                    <td key={propertyIndex}>
                      <p>{prop[propertyName]}</p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
