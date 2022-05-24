import React, { useState } from "react";
const DEFAULT_DATA = {
  title: "",
  content: "",
  created_at: "",
};
const API = "http://localhost:3000/feedbacks";
function DetailFeedback({ news, feedback }) {
  const [showInfo, setShowInfo] = useState(false);
  const [data, setData] = useState({});
  const handleOnChange = () => {};
  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("update", data);
    setData(DEFAULT_DATA);
  };
  const handleReset = (e) => {
    e.preventDefault();
    console.log("reset");
    setData(DEFAULT_DATA);
  };
  const handleFix = () => {
    setData(news);
    console.log(news);
  };
  const handleDeleteFeedback = async () => {
    console.log("delete");
    // setShowModal({ isShow: false });
    await fetch(`${API}/${feedback.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  };
  return (
    <>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Detail</h4>
              <br />
              <div className="alert alert-primary" role="alert">
                <div className="mb-2">
                  Feedback ID:{" "}
                  <span className="text-danger">{feedback.id}</span>
                </div>
                <div className="mb-2">
                  UserName:{" "}
                  <span className="text-danger">{feedback.username}</span>
                </div>
                <div className="mb-2">
                  News ID: <span className="text-danger">{news.id}</span>
                </div>
                <div className="mb-2">
                  Detail News:{" "}
                  <i
                    className={`mdi mdi-eye${showInfo ? "-off" : ""}`}
                    onClick={() => {
                      setShowInfo(!showInfo);
                    }}
                  ></i>
                </div>
                {showInfo && (
                  <div className="detail-news">
                    <div className="mb-2">
                      Title: <span className="text-danger">{news.title}</span>
                    </div>
                    <div className="mb-2">
                      Content:{" "}
                      <span className="text-danger">{news.content} </span>
                    </div>
                    <div className="mb-2">
                      Source:{" "}
                      <a href="#" className="alert-link">
                        {news.description}
                      </a>
                    </div>
                  </div>
                )}
                <div className="mb-2">
                  Type: <span className="text-danger">{feedback.type}</span>
                </div>
                <div className="mb-2">
                  Description:{" "}
                  <span className="text-danger">{feedback.description}</span>
                </div>
                <div className="mb-2">
                  Time: <span className="text-danger">{news.updated_at}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                  onClick={handleFix}
                >
                  Fix
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteFeedback}
                >
                  Delete
                </button>
              </div>
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
                    className="form-control"
                    id="exampleInputName1"
                    placeholder="Enter title"
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
                      placeholder="Enter content"
                    />
                    <div className="question__form__img-review"></div>
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
                    <option value="DT">Dan Tri</option>
                    <option value="VNE">Vietnam Express</option>
                    <option value="TM">Tin moi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Create at</label>
                  <div className="input-group">
                    <input
                      name="created_at"
                      value={data.created_at}
                      onChange={(e) => handleOnChange(e)}
                      type="text"
                      className="form-control"
                      id="exampleInputName1"
                      placeholder="Enter full name"
                    />
                    <div className="question__form__img-review"></div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleUpdate(e)}
                  type="submit"
                  className="btn btn-icon-text btn-gradient-info mr-2 btn-submit"
                >
                  <i className="btn-icon-prepend fas fa-paper-plane"></i>
                  Update
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
    </>
  );
}

export default DetailFeedback;
