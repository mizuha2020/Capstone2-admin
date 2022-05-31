import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Pagination from "./Pagination";
const _ = require("lodash");
const DEFAULT_DATA = {
  name: "",
  username: "",
  password: "",
  city: "",
  role: "select",
  favorites: [],
};
const DEFAULT_ERROR = {
  name: false,
  username: false,
  password: false,
  city: false,
};
const NAME_PATTERN = /^[\D0-9]+$/g;
function User(props) {
  // data
  const [data, setData] = useState(DEFAULT_DATA);
  const [userList, setUserList] = useState([]);
  //validator
  const [err, setErr] = useState(DEFAULT_ERROR);
  // state
  const [isUpdate, setIsUpdate] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [showModal, setShowModal] = useState({});
  const [showPass, setShowPass] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  // sort
  const [nameAsc, setNameAsc] = useState(true);
  const [userNameAsc, setUserNameAsc] = useState(true);
  const [cityAsc, setCityAsc] = useState(true);
  const [roleAsc, setRoleAsc] = useState(true);
  const [subAsc, setSubAsc] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = userList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //FETCH DATA
  useEffect(() => {
    renderList();
  }, []);
  // render list data
  const renderList = async () => {
    await fetch("https://vietnamnewsmap.herokuapp.com/users")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setUserList(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        setLoadComplete(true);
      });
  };
  //add & update data
  const handleCreate = async (e) => {
    e.preventDefault();
    if (err.name && err.username && err.password && err.city) {
      if (isUpdate) {
        console.log("update", data);
        await fetch(`https://vietnamnewsmap.herokuapp.com/users/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Upadte Success")
      } else {
        const newData = createData(data);
        console.log("create", newData);
        await fetch("https://vietnamnewsmap.herokuapp.com/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
        alert("Create Success");
      }
      renderList();
      setData(DEFAULT_DATA);
    } else console.log("err");
  };
  //reset input fields
  const handleReset = (e) => {
    e.preventDefault();
    setData(DEFAULT_DATA);
  };
  // delete data
  const handleDeleteUser = async () => {
    console.log("delete");
    setShowModal({ isShow: false });
    await fetch(`https://vietnamnewsmap.herokuapp.com/users/${showModal.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    alert("Delete Success");
    setData(DEFAULT_DATA);
    renderList();
  };
  // handle modal
  const handleDelete = (user) => {
    setShowModal({ isShow: true, ...user });
  };
  const handleCancel = () => {
    setShowModal({ isShow: false });
  };
  // add button event
  const handleAdd = () => {
    setIsUpdate(false);
  };
  // handle input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
  };
  const handleChangeItemPerPage = (e) => {
    setItemPerPage(e.target.value);
  };
  //create data without id
  const createData = ({ id, ...obj }) => {
    return obj;
  };
  // SORT
  const handleSortName = () => {
    setNameAsc(!nameAsc);
    if (nameAsc) {
      setUserList(_.orderBy(userList, "name"));
    } else {
      setUserList(_.orderBy(userList, "name", "desc"));
    }
  };
  const handleSortUserName = () => {
    setUserNameAsc(!userNameAsc);
    if (userNameAsc) {
      setUserList(_.orderBy(userList, "username"));
    } else {
      setUserList(_.orderBy(userList, "username", "desc"));
    }
  };
  const handleSortRole = () => {
    setRoleAsc(!roleAsc);
    if (roleAsc) {
      setUserList(_.orderBy(userList, "role"));
    } else {
      setUserList(_.orderBy(userList, "role", "desc"));
    }
  };
  const handleSortCity = () => {
    setCityAsc(!cityAsc);
    if (cityAsc) {
      setUserList(_.orderBy(userList, "city"));
    } else {
      setUserList(_.orderBy(userList, "city", "desc"));
    }
  };
  const handleSortSub = () => {
    setSubAsc(!subAsc);
    if (subAsc) {
      setUserList(_.orderBy(userList, "favorites.length"));
    } else {
      setUserList(_.orderBy(userList, "city", "desc"));
    }
  };
  // edit btn event
  const handleEdit = (user) => {
    console.log(user);
    setIsUpdate(true);
    setData(user);
  };
  //Validation data
  const validate = (str, pattern, minLength, maxLength) => {
    return (
      str.match(pattern) && str.length > minLength && str.length <= maxLength
    );
  };
  useEffect(() => {
    if (!validate(data.name, NAME_PATTERN, 6, 50)) {
      setErr((prevErr) => ({ ...prevErr, name: false }));
    } else setErr((prevErr) => ({ ...prevErr, name: true }));
    if (!validate(data.username, NAME_PATTERN, 3, 10)) {
      setErr((prevErr) => ({ ...prevErr, username: false }));
    } else if (
      !isUpdate &&
      userList.some((user) => user.username === data.username)
    ) {
      //duplicate
      setErr((prevErr) => ({ ...prevErr, username: false }));
      setIsDuplicate(true);
    } else {
      //no duplicate
      setIsDuplicate(false);
      setErr((prevErr) => ({ ...prevErr, username: true }));
    }
    if (!validate(data.password, NAME_PATTERN, 6, 30)) {
      setErr((prevErr) => ({ ...prevErr, password: false }));
    } else setErr((prevErr) => ({ ...prevErr, password: true }));
    if (!validate(data.city, NAME_PATTERN, 2, 50)) {
      setErr((prevErr) => ({ ...prevErr, city: false }));
    } else setErr((prevErr) => ({ ...prevErr, city: true }));
  }, [data, isUpdate]);

  // show pass
  const togglePassword = (e, id) => {
    setShowPass((prev) => {
      const isShow = showPass.includes(id);
      if (isShow) {
        return showPass.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">User Management</h3>
        <nav aria-label="breadcrumb"></nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">User List</h4>
              <a className="float-right" href="#add">
                <button
                  className="btn-icon-text btn btn-sm btn-info"
                  onClick={handleAdd}
                >
                  <i className="btn-icon-prepend fas fa-plus"></i>Add New User
                </button>
              </a>
              <a href="#top" className="go-to-top">
                <button className="btn btn-gradient-info btn-rounded btn-icon">
                  <i className="fas fa-arrow-up"></i>
                </button>
              </a>
              <div className="row mt-3">
                <div className="col-8"></div>
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="exampleInputName1">
                      <h5>Item per page</h5>
                    </label>
                    <select
                      onChange={(e) => handleChangeItemPerPage(e)}
                      className="form-control"
                      id="exampleSelectGender"
                      style={{ cursor: "pointer" }}
                    >
                      <option disabled>select</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th onClick={handleSortName}>
                      Full Name
                      <i
                        className={`${
                          nameAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortUserName}>
                      Username
                      <i
                        className={`${
                          userNameAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th>Password</th>
                    <th onClick={handleSortCity}>
                      City
                      <i
                        className={`${
                          cityAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortSub}>
                      Subscribe topic
                      <i
                        className={`${
                          subAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortRole}>
                      Role
                      <i
                        className={`${
                          subAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th className="th-control">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loadComplete ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <Loader />
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    currentItem.map((user, index) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>
                          <span
                            className="password "
                            style={{
                              WebkitTextSecurity: `${
                                showPass.includes(user.id) ? "" : "disc"
                              }`,
                              marginRight: "10px",
                            }}
                          >
                            {user.password}
                          </span>
                          <i
                            onClick={(e) => togglePassword(e, user.id)}
                            className={`mdi mdi-eye${
                              showPass.includes(user.id) ? "-off" : ""
                            }`}
                            style={{
                              fontSize: "16px",
                            }}
                          ></i>
                        </td>
                        <td>{user.city}</td>
                        <td style={{ paddingLeft: "70px" }}>
                          {userList[index].favorites.length}
                        </td>
                        <td>{user.role}</td>
                        <td>
                          <a href="#add">
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-sm btn-icon-text btn-gradient-dark btn-edit"
                              style={{ marginRight: "5px" }}
                            >
                              <i className="btn-icon-prepend far fa-edit"></i>
                              Edit
                            </button>
                          </a>
                          <button
                            className="btn btn-sm btn-icon-text btn-gradient-danger btn-delete"
                            onClick={() => handleDelete(user)}
                          >
                            <i className="btn-icon-prepend fas fa-trash-alt"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                itemPerPage={itemPerPage}
                totalItem={userList.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title" id="add">
                Infomation
              </h4>
              <br />
              <form className="forms-sample">
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    value={data.name}
                    name="name"
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className={`form-control ${
                      err.name ? "is-valid" : "is-invalid"
                    }`}
                    id="fullname"
                    placeholder="Enter full name"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Invalid name</div>
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    value={data.username}
                    name="username"
                    onChange={(e) => handleOnChange(e)}
                    placeholder="Enter  userName"
                    className={`form-control ${
                      err.username ? "is-valid" : "is-invalid"
                    }`}
                    id="username"
                    rows="4"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  {isDuplicate ? (
                    <div className="invalid-feedback">Duplicate</div>
                  ) : (
                    <div className="invalid-feedback">Invalid username</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    value={data.password}
                    name="password"
                    onChange={(e) => handleOnChange(e)}
                    placeholder="Enter password"
                    type="password"
                    className={`form-control ${
                      err.password ? "is-valid" : "is-invalid"
                    }`}
                    id="password"
                    rows="4"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Invalid password</div>
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    value={data.city}
                    name="city"
                    onChange={(e) => handleOnChange(e)}
                    placeholder="Enter city"
                    className={`form-control ${
                      err.city ? "is-valid" : "is-invalid"
                    }`}
                    id="city"
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputName1">Role</label>
                  <select
                    value={data.role}
                    name="role"
                    onChange={(e) => handleOnChange(e)}
                    className="form-control"
                    id="exampleSelectGender"
                    style={{ cursor: "pointer" }}
                  >
                    <option disabled>select</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>
                <button
                  onClick={(e) => handleCreate(e)}
                  type="submit"
                  className="btn btn-icon-text btn-gradient-info mr-2 btn-submit"
                >
                  <i className="btn-icon-prepend fas fa-paper-plane"></i>
                  {isUpdate ? "Update" : "Create"}
                </button>
                <button
                  className="btn btn-icon-text btn-gradient-dark btn-reset"
                  onClick={(e) => handleReset(e)}
                >
                  <i className="btn-icon-prepend fas fa-redo-alt"></i>Reset
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal"
        style={{ display: `${showModal.isShow ? "" : "none"}` }}
      >
        <div className="overlay">
          <div className="modal__body">
            <h3>Delete this user?</h3>
            <div className="btn-wrapper">
              <button
                className="btn btn-gradient-success mr-2 btn-agree"
                onClick={handleDeleteUser}
              >
                Yes
              </button>
              <button
                className="btn btn-gradient-danger mr-2 btn-reject"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
