import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const DEFAULT_ADMIN = {
  username: "",
  password: "",
  role: "",
};
function SignIn(props) {
  const [admin, setAdmin] = useState(DEFAULT_ADMIN);
  const [adminList, setAdminList] = useState([]);
  const [supList, setSupList] = useState([]);
  const [err, setErr] = useState(false);
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    await fetch("https://vietnamnewsmap.herokuapp.com/users")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        const admin = data.filter((user) => user.role == "Admin");
        setAdminList(admin);
        const sup = data.filter((sup) => sup.role == "Supporter");
        setSupList(sup);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      });
  };
  const handleSignIn = () => {
    if (
      adminList.some(
        (user) =>
          user.username == admin.username && user.password == admin.password
      )
    ) {
      alert("ok admin");
      props.onIsAdmin(true);
      props.onCurrentUser({ ...admin, role: "Admin" });
      props.onClickMenu(0);
    } else if (
      supList.some(
        (user) =>
          user.username == admin.username && user.password == admin.password
      )
    ) {
      alert("ok sup");
      props.onIsAdmin(false);
      props.onCurrentUser({ ...admin, role: "Supporter" });
      props.onClickMenu(0);
    } else setErr(true);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const newUser = { ...admin, [name]: value };
    setAdmin(newUser);
  };
  return (
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth">
        <div className="row flex-grow">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left p-5">
              <div className="brand-logo">
                <h1 style={{ color: "#b66dff" }}>Admin</h1>
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              {err ? (
                <h6 className="font-weight-light" style={{ color: "tomato" }}>
                  Wrong username or password
                </h6>
              ) : (
                ""
              )}
              <form className="pt-3">
                <div className="form-group">
                  <input
                    value={admin.username}
                    name="username"
                    onChange={(e) => handleOnChange(e)}
                    type="email"
                    className="form-control form-control-lg"
                    id="exampleInputEmail1"
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <input
                    value={admin.password}
                    name="password"
                    onChange={(e) => handleOnChange(e)}
                    type="password"
                    className="form-control form-control-lg"
                    id="exampleInputPassword1"
                    placeholder="Password"
                  />
                </div>
                <div className="container text-center">
                  <Link
                    className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                    to="/"
                    onClick={handleSignIn}
                  >
                    SIGN IN
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
