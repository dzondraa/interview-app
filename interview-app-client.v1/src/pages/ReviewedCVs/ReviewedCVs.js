import Sidebar from "../../components/Partials/Sidebar/Sidebar";
import Api from '../../services/Service'
import "./ReviewedCVs.css";

const Questions = () => {
  const api = new Api();
  getData()
  
  async function getData() {
    const result = await api.get("documents")
    return result
  }
  return (
    <div className="container-fluid questions-main">
      <div className="row">
        <Sidebar></Sidebar>
      </div>
    </div>
  );
};

export default Questions;
