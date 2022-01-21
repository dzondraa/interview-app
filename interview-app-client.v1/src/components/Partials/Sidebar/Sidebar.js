import "./Sidebar.css";
// get our fontawesome imports
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const navigation = [
    { name: "Build CV", href: "#" },
    { name: "Reviewed CVs", href: "#" },
  ];
  return (
    <div className="col-lg-4 sidebar-container">
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="index.html"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <FontAwesomeIcon
              icon={faFolderPlus}
              style={{
                fontSize: 30,
              }}
            />
          </div>
          <div className="sidebar-brand-text mx-3">
            <sup>CV </sup>
            <i>Master</i>
          </div>
        </a>

        {navigation.map((navigationElement, index) => {
          return (
            <li key={index} className="nav-item active">
              <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>{navigationElement.name}</span>
              </a>
              <hr className="sidebar-divider my-0"></hr>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
