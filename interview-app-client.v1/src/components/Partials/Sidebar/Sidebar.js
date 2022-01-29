import "./Sidebar.css";
import { Link } from "react-router-dom";
// get our fontawesome imports
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const navigation = [
    { name: "Build CV", href: "#" },
    {
      name: "Reviewed CVs",
      href: "/reviewed",
    },
    {
      name: "Technical areas",
      href: "/areas",
    },
  ];
  return (
    <div className="col-lg-3 sidebar-container">
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="/"
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
            <Link key={index} to={navigationElement.href}>
              <li className="nav-item active">
                <p className="nav-link" href="#">
                  <i className="fas fa-fw fa-tachometer-alt"></i>
                  <span>{navigationElement.name}</span>
                </p>
                <hr className="sidebar-divider my-0"></hr>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
