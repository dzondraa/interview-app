import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import "./Questions.css";

const Questions = () => {
  const areas = [
    {
      id: 1,
      name: "First",
      parent: 0,
    },
    {
      id: 2,
      name: "Second",
      parent: 0,
    },
    {
      id: 3,
      name: "First-First",
      parent: 1,
    },
    {
      id: 4,
      name: "First-First-First",
      parent: 3,
    },
    {
      id: 5,
      name: "Third",
      parent: 0,
    },
  ];

  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
      </div>
    </div>
  );
};

export default Questions;
