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
        {schema.properties.map((prop, index) => {
          return (
            <tr key={index}>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
            </tr>
          );
        })}
        
      </tbody>
    </table>
  );
};

export default DynamicTable;
