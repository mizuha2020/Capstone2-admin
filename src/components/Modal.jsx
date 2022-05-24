import React, { useState } from "react";

function Modal(props) {
  //   console.log("asd");
  const [showModal, setShowModal] = useState(true);
  const handleDelete = () => {
    console.log("delete");
    fetch(`http://localhost:3000/users/${props.userID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  };
  const handleCancel = () => {
    setShowModal(false);
    props.onClickDelete(showModal);
  };
  return (
    <div className="modal" style={{ display: `${showModal ? "" : "none"}` }}>
      <div className="overlay">
        <div className="modal__body">
          <h3>Delete this user?</h3>
          <div className="btn-wrapper">
            <button
              className="btn btn-gradient-success mr-2 btn-agree"
              onClick={handleDelete}
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
  );
}

export default Modal;
