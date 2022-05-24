import React, { useState } from "react";

function Pagination({ itemPerPage, totalItem, paginate }) {
  const pageNumbers = [];
  const [curNumber, setCurNumber] = useState(1);
  for (let i = 1; i <= Math.ceil(totalItem / itemPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="mt-3">
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${curNumber <= 1 ? "disabled" : ""}`}
            onClick={() => {
              if (curNumber <= 1) {
                paginate(1);
                setCurNumber(1);
              } else {
                paginate(curNumber - 1);
                setCurNumber(curNumber - 1);
              }
            }}
          >
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${number == curNumber ? "active" : ""}`}
              onClick={() => {
                paginate(number);
                setCurNumber(number);
              }}
            >
              <a className="page-link" href="#">
                {number}
              </a>
            </li>
          ))}
          <li
            className={`page-item ${
              curNumber >= pageNumbers.length ? "disabled" : ""
            }`}
            onClick={() => {
              if (curNumber >= pageNumbers.length) {
                paginate(pageNumbers.length);
                setCurNumber(pageNumbers.length);
              } else {
                paginate(curNumber + 1);
                setCurNumber(curNumber + 1);
              }
            }}
          >
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Pagination;
