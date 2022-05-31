import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Pagination from "./Pagination";
const _ = require("lodash");
const DEFAULT_DATA = {
  title: "",
  content: "",
  // created_at: Date.now(),
};
const DEFAULT_ERROR = {
  title: true,
  content: false,
};
const NAME_PATTERN = /^[\D0-9]+$/g;
const API = "https://vietnamnewsmap.herokuapp.com/";
function News() {
  // data
  const [data, setData] = useState(DEFAULT_DATA);
  const [newsList, setNewsList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  //validator
  const [err, setErr] = useState(DEFAULT_ERROR);
  // state
  const [isUpdate, setIsUpdate] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [showModal, setShowModal] = useState({});
  // sort
  const [titleAsc, setTitleAsc] = useState(true);
  const [sourceAsc, setSourceAsc] = useState(true);
  const [timeAsc, setTimeAsc] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = newsList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //FETCH DATA
  useEffect(() => {
    renderList();
    getListSources();
  }, []);
  //get time now
  function formatDate(today) {
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return date + " " + time;
  }
  const getTimeNow = () => {
    const today = new Date();
    return formatDate(today);
  };
  // render list data
  const renderList = async () => {
    await fetch(`${API}news`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setNewsList(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        setLoadComplete(true);
      });
  };
  const getListSources = async () => {
    await fetch(`http://localhost:3000/sources`)
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
      .finally(() => {});
  };
  //add & update data
  const handleCreate = async (e) => {
    e.preventDefault();
    if (err.title && err.content) {
      if (isUpdate) {
        console.log("update", data);
        await fetch(`${API}news/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, updated_at: getTimeNow() }),
        });
        alert("Upadte Success");
      } else {
        const newData = createData(data);
        console.log("create", newData);
        await fetch(`${API}news`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newData, created_at: getTimeNow() }),
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
  const handleDeleteNews = async () => {
    console.log("delete");
    setShowModal({ isShow: false });
    await fetch(`${API}news/${showModal.id}`, {
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
  const handleSortTime = () => {
    setTimeAsc(!timeAsc);
    if (timeAsc) {
      setNewsList(_.orderBy(newsList, "created_at"));
    } else {
      setNewsList(_.orderBy(newsList, "created_at", "desc"));
    }
  };
  const handleSortTitle = () => {
    setTitleAsc(!titleAsc);
    if (titleAsc) {
      setNewsList(_.orderBy(newsList, "title"));
    } else {
      setNewsList(_.orderBy(newsList, "title", "desc"));
    }
  };
  const handleSortSource = () => {
    setSourceAsc(!sourceAsc);
    if (sourceAsc) {
      setNewsList(_.orderBy(newsList, "description"));
    } else {
      setNewsList(_.orderBy(newsList, "description", "desc"));
    }
  };
  // edit btn event
  const handleEdit = (news) => {
    console.log(news);
    setIsUpdate(true);
    setData(news);
  };
  //Validation data
  const validate = (str, pattern, minLength, maxLength) => {
    return (
      str.match(pattern) && str.length > minLength && str.length <= maxLength
    );
  };
  useEffect(() => {
    if (!validate(data.title, NAME_PATTERN, 0, 100)) {
      setErr((prevErr) => ({ ...prevErr, title: false }));
    } else setErr((prevErr) => ({ ...prevErr, title: true }));

    if (!validate(data.content, NAME_PATTERN, 0, 550)) {
      setErr((prevErr) => ({ ...prevErr, content: false }));
    } else setErr((prevErr) => ({ ...prevErr, content: true }));
  }, [data]);
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">News Management</h3>
        <nav aria-label="breadcrumb"></nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">News List</h4>
              <a className="float-right" href="#add">
                <button
                  className="btn-icon-text btn btn-sm btn-info"
                  onClick={handleAdd}
                >
                  <i className="btn-icon-prepend fas fa-plus"></i>Add New News
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
                      <option value="10" selected>
                        10
                      </option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th onClick={handleSortTitle}>
                      Title
                      <i
                        className={`${
                          titleAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortSource}>
                      Source
                      <i
                        className={`${
                          sourceAsc
                            ? "mdi mdi-sort-ascending"
                            : "mdi mdi-sort-descending"
                        }`}
                      ></i>
                    </th>
                    <th onClick={handleSortTime}>
                      Create at
                      <i
                        className={`${
                          timeAsc
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
                      <td style={{ paddingLeft: "15%" }}>
                        <Loader />
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    currentItem.map((newsItem) => (
                      <tr key={newsItem.id}>
                        <td className="news-title">{newsItem.title}</td>
                        <td>{newsItem.description}</td>
                        <td>{newsItem.created_at}</td>
                        <td>
                          <a href="#add">
                            <button
                              onClick={() => handleEdit(newsItem)}
                              className="btn btn-sm btn-icon-text btn-gradient-dark btn-edit"
                              style={{ marginRight: "5px" }}
                            >
                              <i className="btn-icon-prepend far fa-edit"></i>
                              Edit
                            </button>
                          </a>
                          <button
                            className="btn btn-sm btn-icon-text btn-gradient-danger btn-delete"
                            onClick={() => handleDelete(newsItem)}
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
                totalItem={newsList.length}
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
                Update Infomation
              </h4>
              <br />
              <form className="forms-sample">
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Title</label>
                  <input
                    name="title"
                    value={data.title}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className={`form-control ${
                      err.title ? "is-valid" : "is-invalid"
                    }`}
                    id="exampleInputName1"
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Invalid title</div>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <div className="input-group">
                    <input
                      name="content"
                      value={data.content}
                      onChange={(e) => handleOnChange(e)}
                      type="text"
                      className={`form-control ${
                        err.content ? "is-valid" : "is-invalid"
                      }`}
                      id="exampleInputName1"
                    />
                    <div className="question__form__img-review"></div>
                  </div>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Invalid content</div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputName1">Source</label>
                  <select
                    value={data.description}
                    name="description"
                    onChange={(e) => handleOnChange(e)}
                    className="form-control"
                    id="exampleSelectGender"
                    style={{ cursor: "pointer" }}
                  >
                    <option disabled>select</option>
                    {sourceList.map((sources) => (
                      <option key={sources.id} value={sources.name}>
                        {sources.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="form-group">
                  <label>Created at</label>
                  <div className="input-group">
                    <input
                      disabled
                      // name="created_at"
                      // onChange={(e) => handleOnChange(e)}
                      value={data.created_at}
                      type="text"
                      className="form-control"
                      id="exampleInputName1"
                    />
                    <div className="question__form__img-review"></div>
                  </div>
                </div> */}
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
            <h3>Delete this news?</h3>
            <div className="btn-wrapper">
              <button
                className="btn btn-gradient-success mr-2 btn-agree"
                onClick={handleDeleteNews}
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

export default News;
