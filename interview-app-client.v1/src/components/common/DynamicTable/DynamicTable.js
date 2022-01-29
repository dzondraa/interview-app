import noDataImg from "../../../assets/images/nodata.png";

const DynamicTable = ({ props }) => {
  return props.data.data.length > 0 ? (
    <div
      style={{
        overflow: "auto",
        height: "600px",
      }}
    >
      <table className="table table-hover smart-bear-dyntable">
        <thead>
          <tr>
            <th scope="col">#</th>
            {props.schema.properties.map((prop, index) => {
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
          {props.data.data.map((prop, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                {props.schema.properties.map((propertyName, propertyIndex) => {
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
  ) : (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <img
        style={{
          height: "400px",
        }}
        src={noDataImg}
      ></img>
      <h2>We were not able to collect any data :/</h2>
    </div>
  );
};

export default DynamicTable;
