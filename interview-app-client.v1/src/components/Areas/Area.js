const Area = ({area}) => {
    console.log(area);
  return (
    <div className="card" style={{width: '18rem'}}>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <b>{area.name}</b>
        </li>
        {area.subareas.map((subarea, key) => {
          return <Area area={subarea} key={key}></Area>
        })}
      </ul>
    </div>
  );
};

export default Area;
