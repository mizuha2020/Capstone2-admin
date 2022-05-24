import React, { useEffect, useState } from "react";
import DetailFeedback from "./DetailFeedback";
import Loader from "./Loader";
import Pagination from "./Pagination";
const _ = require("lodash");

function Feedback() {
  // data
  const [feedback, setFeedback] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [news, setNews] = useState({});
  // state
  const [isDetail, setIsDetail] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  // sort
  const [nameAsc, setNameAsc] = useState(true);
  const [linkAsc, setLinkAsc] = useState(true);
  const [typeAsc, setTypeAsc] = useState(true);
  const [timeAsc, setTimeAsc] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = feedbackList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //FETCH DATA
  useEffect(() => {
    renderList();
  }, []);
  //get news
  const getNewFeedback = async (id) => {
    await fetch(`http://localhost:3000/news/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setNews(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        setLoadComplete(true);
      });
  };
  // render list data
  const renderList = async () => {
    await fetch("http://localhost:3000/feedbacks")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setFeedbackList(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        setLoadComplete(true);
      });
  };
  //function
  const handleDetail = (e, feedback) => {
    e.preventDefault();
    setFeedback(feedback);
    setIsDetail(true);
    getNewFeedback(feedback.newsId);
    window.scrollTo(0, 700);
  };
  const handleChangeItemPerPage = (e) => {
    setItemPerPage(e.target.value);
  };
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">Feedback Management</h3>
        <nav aria-label="breadcrumb"></nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Feedback List</h4>
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
                    <th>Username</th>
                    <th>News ID</th>
                    <th>Feedback</th>
                    <th>Update at</th>
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
                    currentItem.map((feedback, index) => (
                      <tr key={index}>
                        <td>{feedback.username}</td>
                        <td>{feedback.newsId}</td>
                        <td>{feedback.description}</td>
                        <td>{feedback.update_at}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-icon-text btn-gradient-info"
                            onClick={(e) => handleDetail(e, feedback)}
                          >
                            <i className="btn-icon-prepend mdi mdi-eye"></i>View
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                itemPerPage={itemPerPage}
                totalItem={feedbackList.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
      {isDetail ? <DetailFeedback news={news} feedback={feedback} /> : ""}
    </div>
  );
}

export default Feedback;
