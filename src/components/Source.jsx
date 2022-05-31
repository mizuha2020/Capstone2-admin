import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Pagination from "./Pagination";
const _ = require("lodash");
const DEFAULT_DATA = {
  name: "",
  link: "",
  thumbnailUrl: "",
};
const DEFAULT_ERROR = {
  name: true,
  link: false,
};
const NAME_PATTERN = /^[\D0-9]+$/g;
// eslint-disable-next-line
const LINK_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
function Source() {
  // data
  const [data, setData] = useState(DEFAULT_DATA);
  const [sourceList, setSourceList] = useState([]);
  //validator
  const [err, setErr] = useState(DEFAULT_ERROR);
  // state
  const [isUpdate, setIsUpdate] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [showModal, setShowModal] = useState({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  // sort
  const [nameAsc, setNameAsc] = useState(true);
  const [linkAsc, setLinkAsc] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = sourceList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //FETCH DATA
  useEffect(() => {
    renderList();
  }, []);
  // render list data
  const renderList = async () => {
    await fetch("http://localhost:3000/sources")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setSourceList(data);
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
    if (err.name && err.link) {
      if (isUpdate) {
        console.log("update", data);
        await fetch(`http://localhost:3000/sources/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Upadte Success");
      } else {
        const newData = createData(data);
        console.log("create", newData);
        await fetch("http://localhost:3000/sources", {
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
  const handleDeleteSource = async () => {
    console.log("delete");
    setShowModal({ isShow: false });
    await fetch(`http://localhost:3000/sources/${showModal.id}`, {
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
      setSourceList(_.orderBy(sourceList, "name"));
    } else {
      setSourceList(_.orderBy(sourceList, "name", "desc"));
    }
  };
  const handleSortLink = () => {
    setLinkAsc(!linkAsc);
    if (linkAsc) {
      setSourceList(_.orderBy(sourceList, "link"));
    } else {
      setSourceList(_.orderBy(sourceList, "link", "desc"));
    }
  };
  // edit btn event
  const handleEdit = (source) => {
    console.log(source);
    setIsUpdate(true);
    setData(source);
  };
  //Validation data
  const validate = (str, pattern, minLength, maxLength) => {
    return (
      str.match(pattern) && str.length > minLength && str.length <= maxLength
    );
  };
  useEffect(() => {
    if (!validate(data.name, NAME_PATTERN, 0, 30)) {
      setErr((prevErr) => ({ ...prevErr, name: false }));
    } else setErr((prevErr) => ({ ...prevErr, name: true }));

    if (!validate(data.link, LINK_PATTERN, 9, 50)) {
      setErr((prevErr) => ({ ...prevErr, link: false }));
    } else if (sourceList.some((sources) => sources.link === data.link)) {
      //duplicate
      setErr((prevErr) => ({ ...prevErr, link: false }));
      setIsDuplicate(true);
    } else {
      //no duplicate
      setIsDuplicate(false);
      setErr((prevErr) => ({ ...prevErr, link: true }));
    }
  }, [data]);
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">News Source Management</h3>
        <nav aria-label="breadcrumb"></nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sources List</h4>
              <a className="float-right" href="#add">
                <button
                  className="btn-icon-text btn btn-sm btn-info"
                  onClick={handleAdd}
                >
                  <i className="btn-icon-prepend fas fa-plus"></i>Add New Source
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
                    <th>ID</th>
                    <th onClick={handleSortName}>
                      Source Name
                      <i
                        className={`${
                          nameAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortLink}>
                      Source Link
                      <i
                        className={`${
                          linkAsc
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
                      <td>
                        <Loader />
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    currentItem.map((source, index) => (
                      <tr key={source.id}>
                        <td>{index + itemPerPage * (currentPage - 1) + 1}</td>
                        <td>{source.name}</td>
                        <td>{source.link}</td>
                        <td>
                          <a href="#add">
                            <button
                              onClick={() => handleEdit(source)}
                              className="btn btn-sm btn-icon-text btn-gradient-dark btn-edit"
                              style={{ marginRight: "5px" }}
                            >
                              <i className="btn-icon-prepend far fa-edit"></i>
                              Edit
                            </button>
                          </a>
                          <button
                            className="btn btn-sm btn-icon-text btn-gradient-danger btn-delete"
                            onClick={() => handleDelete(source)}
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
                totalItem={sourceList.length}
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
                  <label htmlFor="exampleInputName1">Source Name</label>
                  <input
                    name="name"
                    value={data.name}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className={`form-control ${
                      err.name ? "is-valid" : "is-invalid"
                    }`}
                    id="exampleInputName1"
                    placeholder="Enter full name"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Invalid name</div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Link</label>
                  <input
                    name="link"
                    value={data.link}
                    onChange={(e) => handleOnChange(e)}
                    className={`form-control ${
                      err.link ? "is-valid" : "is-invalid"
                    }`}
                    id="exampleTextarea1"
                    rows="4"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  {isDuplicate ? (
                    <div className="invalid-feedback">Duplicate</div>
                  ) : (
                    <div className="invalid-feedback">Invalid link</div>
                  )}
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
            <h3>Delete this source?</h3>
            <div className="btn-wrapper">
              <button
                className="btn btn-gradient-success mr-2 btn-agree"
                onClick={handleDeleteSource}
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

export default Source;
