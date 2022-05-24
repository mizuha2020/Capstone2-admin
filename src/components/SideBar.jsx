import React, { useState } from "react";
import { Link } from "react-router-dom";
const sideBarMenu = [
  { name: "Dashboard", icon: "mdi mdi-chart-arc" },
  { name: "Manage User", icon: "mdi mdi-human-greeting" },
  { name: "Manage Source", icon: "mdi mdi-source-branch" },
  { name: "Manage News", icon: "mdi mdi-newspaper" },
  { name: "Manage Feedback", icon: "mdi mdi-comment-processing-outline" },
];
function SideBar(props) {
  const [menu, setMenu] = useState(0);
  const handleSelect = (e, index) => {
    setMenu(index);
    props.onClickMenu(index);
  };
  return (
    <nav
      className="sidebar sidebar-offcanvas"
      id="sidebar"
      style={{ position: "fixed" }}
    >
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="nav-profile-image">
              <img
                src="https://vcdn-vnexpress.vnecdn.net/2021/03/02/103650164-731814290963011-1374-5806-7233-1614677857.jpg"
                alt="profile"
              />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">
                {props.currentUser.username}
              </span>
              <span className="text-secondary text-small">
                {props.currentUser.role}
              </span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        {props.isAdmin ? (
          sideBarMenu.map((menuElement, index) => (
            <li
              style={{ cursor: "pointer" }}
              className={`${index == menu ? "active" : ""} nav-item`}
              key={menuElement.name}
              onClick={(e) => handleSelect(e, index)}
            >
              <Link className="nav-link" to={`/${menuElement.name}`}>
                <span className="menu-title">{menuElement.name}</span>
                <i className={`${menuElement.icon} menu-icon`}></i>
              </Link>
            </li>
          ))
        ) : (
          <li style={{ cursor: "pointer" }} className="active nav-item ">
            <Link className="nav-link" to="/Editor">
              <span className="menu-title">Editor</span>
              <i className="menu-icon mdi mdi-table-edit"></i>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default SideBar;
