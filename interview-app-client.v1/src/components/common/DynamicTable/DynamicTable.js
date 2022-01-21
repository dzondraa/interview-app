const DynamicTable = (props) => {
  const schema = {
    properties: ["File name", "Relevancy scale"],
  };
  console.log(props);
  return (
    <table className="table table-hover smart-bear-dyntable">
      <thead>
        <tr>
          <th scope="col">#</th>
          {schema.properties.map((prop, index) => {
            return <th key={index}>{prop}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {props.props.map((prop, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index}</th>
              <td>{prop}</td>
              <td>10</td>
            </tr>
          );
        })}
        
      </tbody>
    </table>
  );
};

export default DynamicTable;
