import React, { useState } from "react";
import "./assets/css/style.css";
import "./assets/vendors/mdi/css/materialdesignicons.min.css";
import Event from "./components/Event";
// import ErrorPage from "./components/ErrorPage";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import Home from "./components/Home";
import User from "./components/User";
import Source from "./components/Source";
import News from "./components/News";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
function App() {
  const [currentUser, setCurrentUser] = useState({ username: "Admin" });
  const [indexMenu, setIndexMenu] = useState(0);
  const menuPage = ["Home", "User", "Source", "News", "Feedback"];
  const handleMenu = (index) => {
    setIndexMenu(index);
  };
  const getCurrentUser = (user) => {
    setCurrentUser(user);
  };
  return (
    <div className="container-scroller">
      {indexMenu == 99 ? (
        <>
          <SignIn onCurrentUser={getCurrentUser} onClickMenu={handleMenu} />
        </>
      ) : (
        <>
          <Header currentUser={currentUser} onClickMenu={handleMenu} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar onClickMenu={handleMenu} />
            <div className="main-panel" style={{ marginLeft: "300px" }}>
              {menuPage[indexMenu] == "Home" ? (
                <Home menu={indexMenu} />
              ) : menuPage[indexMenu] == "User" ? (
                <User menu={indexMenu} />
              ) : menuPage[indexMenu] == "Source" ? (
                <Source menu={indexMenu} />
              ) : menuPage[indexMenu] == "News" ? (
                // <News menu={indexMenu} />
                <Event menu={indexMenu} />
              ) : menuPage[indexMenu] == "Feedback" ? (
                <Feedback menu={indexMenu} />
              ) : (
                ""
              )}
              <Footer></Footer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
