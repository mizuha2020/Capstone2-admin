import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Pagination from "./Pagination";
import Editor from "./Editor";
const _ = require("lodash");
const DEFAULT_DATA = {
  title: "",
  header: "",
  location: "",
  x: 0,
  y: 0,
  description: "Dan Tri",
  cover: "",
  pic1: "",
  pic2: "",
  type: "",
  news1: "",
  news2: "",
};
const API = "https://vietnamnewsmap.herokuapp.com/";
function Event() {
  // data
  const [data, setData] = useState(DEFAULT_DATA);
  const [newsList, setNewsList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [content, setContent] = useState("");
  const [news1, setNew1] = useState("");
  const [news2, setNew2] = useState("");
  // state
  const [loadComplete, setLoadComplete] = useState(false);
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
  //add data
  const handleCreate = async (e) => {
    e.preventDefault();
    const newData = createData(data);
    console.log("create", newData);
    await fetch(`${API}events`, {
    // await fetch(`http://localhost:3000/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newData,
        type: data.type,
        physic: [parseFloat(data.x), parseFloat(data.y)],
        content: content,
        created_at: getTimeNow(),
        gallery: [data.pic1, data.pic2],
        timeline: [
          {
            time: news1.created_at,
            tittle: news1.title,
            content: news1.content,
            url: "https://github.com/",
          },
          {
            time: news2.created_at,
            tittle: news2.title,
            content: news2.content,
            url: "https://github.com/",
          },
        ],
      }),
    });
    renderList();
    setData(DEFAULT_DATA);
  };
  //reset input fields
  const handleReset = (e) => {
    e.preventDefault();
    setData(DEFAULT_DATA);
  };
  // handle input
  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
  };
  useEffect(() => {
    setNew1(newsList[data.news1]);
    setNew2(newsList[data.news2]);
  }, [data.news1, data.news2]);
  const handleChangeItemPerPage = (e) => {
    setItemPerPage(e.target.value);
  };
  //create data without id
  const createData = ({
    id,
    title,
    x,
    y,
    pic1,
    pic2,
    news1,
    news2,
    ...obj
  }) => {
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
    setData(news);
  };
  //Get change event
  const handleChangeContent = (ev) => {
    setContent(ev);
  };
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">Event Management</h3>
        <nav aria-label="breadcrumb"></nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">News List</h4>
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
                              Create envent
                            </button>
                          </a>
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
                Update Event
              </h4>
              <br />
              <form className="forms-sample">
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Header</label>
                  <input
                    name="header"
                    value={data.header}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Physical Location</label>
                  <a
                    href="https://vietnamgeographicnews.netlify.app/testpage/timtoado/"
                    target="_blank"
                    className="ml-3"
                  >
                    <i className="mdi mdi-map-marker-radius"></i>
                  </a>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm3 col-form-label">X</label>
                        <div className="col-sm-9">
                          <input
                            name="x"
                            value={data.x}
                            onChange={(e) => handleOnChange(e)}
                            type="text"
                            className="form-control"
                            id="exampleInputName1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm3 col-form-label">Y</label>
                        <div className="col-sm-9">
                          <input
                            name="y"
                            value={data.y}
                            onChange={(e) => handleOnChange(e)}
                            type="text"
                            className="form-control"
                            id="exampleInputName1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                <div className="form-group">
                  <label htmlFor="exampleInputName1">Type</label>
                  <select
                    value={data.type}
                    name="type"
                    onChange={(e) => handleOnChange(e)}
                    className="form-control"
                    id="exampleSelectGender"
                    style={{ cursor: "pointer" }}
                  >
                    <option disabled>select</option>
                    <option value="Business">Business</option>
                    <option value="Travel">Travel</option>
                    <option value="Covid">Covid in Viet Nam</option>
                    <option value="Social">Social</option>
                    <option value="Sport">Sport</option>
                  </select>
                </div>
                <div className="form-group">
                  <Editor onChangeContent={handleChangeContent} />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Cover</label>
                  <input
                    name="cover"
                    value={data.cover}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Gallery</label>
                  <input
                    name="pic1"
                    value={data.pic1}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                  />
                  <input
                    name="pic2"
                    value={data.pic2}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea1">Title</label>
                  <input
                    name="title"
                    value={data.title}
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                  />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <div className="input-group">
                    <input
                      name="content"
                      value={data.content}
                      onChange={(e) => handleOnChange(e)}
                      type="text"
                      className="form-control"
                      id="exampleInputName1"
                    />
                    <div className="question__form__img-review"></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputName1">Related news</label>
                  <br />
                  <label htmlFor="exampleInputName1">News1</label>
                  <select
                    value={data.news1}
                    name="news1"
                    onChange={(e) => handleOnChange(e)}
                    className="form-control"
                    id="exampleSelectGender"
                    style={{ cursor: "pointer" }}
                  >
                    <option disabled>select</option>
                    {newsList.map((news, index) => (
                      <option key={news.id} value={index}>
                        {news.title}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="exampleInputName1">News2</label>
                  <select
                    value={data.news2}
                    name="news2"
                    onChange={(e) => handleOnChange(e)}
                    className="form-control"
                    id="exampleSelectGender"
                    style={{ cursor: "pointer" }}
                  >
                    <option disabled>select</option>
                    {newsList.map((news, index) => (
                      <option key={news.id} value={index}>
                        {news.title}
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
                  Create Event
                  <i className="btn-icon-prepend fas fa-paper-plane"></i>
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
    </div>
  );
}

export default Event;
