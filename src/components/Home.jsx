import React, { useEffect, useState } from "react";
import circle from "../assets/images/dashboard/circle.svg";
import DoughChart from "./chart/DoughChart";
import BarChart from "../components/chart/BarChart";
const API = "http://localhost:3000/";
function Home() {
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetch(`${API}users`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        console.log("done");
      });
  }, []);
  useEffect(() => {
    fetch(`${API}sources`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setSources(data);
      })
      .catch((error) => {
        console.error("Fetching Error: ", error);
      })
      .finally(() => {
        console.log("done");
      });
  }, []);
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <i className="mdi mdi-home"></i>
          </span>
          Dashboard
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img
                src={circle}
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                Visitor
                <i className="mdi mdi-account mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">52</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img
                src={circle}
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                User
                <i className="mdi mdi-account-check mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img
                src={circle}
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                News source
                <i className="mdi mdi-newspaper mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{sources.length}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Chart 1</h4>
                <div
                  id="traffic-chart-legend"
                  className="rounded-legend legend-vertical legend-bottom-left pt-4"
                >
                  <BarChart userList={users} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Chart 2</h4>
              <div
                id="traffic-chart-legend"
                className="rounded-legend legend-vertical legend-bottom-left pt-4"
              >
                <DoughChart userList={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Recent Update</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Source page</th>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Topic</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src="https://cdnweb.dantri.com.vn/dist/logo.1-0-1.329fb29fe0ea34cca545.svg"
                          className="me-2"
                          alt="image"
                        />
                        Dan tri
                      </td>
                      <td>
                        Cổ phiếu ngành bất động sản, bán lẻ tiếp tục bị bán mạnh
                      </td>
                      <td>Da Nang</td>
                      <td>
                        <label className="badge badge-gradient-success">
                          Economy
                        </label>
                      </td>
                      <td>April 7, 2022</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src="https://s1.vnecdn.net/vnexpress/restruct/i/v569/v2_2019/pc/graphics/logo.svg"
                          className="me-2"
                          alt="image"
                        />
                        VnExpress
                      </td>
                      <td>
                        Cổ phiếu ngành bất động sản, bán lẻ tiếp tục bị bán mạnh
                      </td>
                      <td>Quang Nam</td>
                      <td>
                        <label className="badge badge-gradient-danger">
                          Sport
                        </label>
                      </td>
                      <td>April 7, 2022</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src="https://static.vnncdn.net/images/vnn-viet-nam-hung-cuong.svg"
                          className="me-2"
                          alt="image"
                        />
                        VietNamNet
                      </td>
                      <td>
                        Cổ phiếu ngành bất động sản, bán lẻ tiếp tục bị bán mạnh
                      </td>
                      <td>Ha Noi</td>
                      <td>
                        <label className="badge badge-gradient-primary">
                          Law and life
                        </label>
                      </td>
                      <td>April 7, 2022</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src="https://static.thanhnien.vn/v4/web/styles/img/TNO_logo2.svg"
                          className="me-2"
                          alt="image"
                        />
                        ThanhNien
                      </td>
                      <td>
                        Cổ phiếu ngành bất động sản, bán lẻ tiếp tục bị bán mạnh
                      </td>
                      <td>Da Nang</td>
                      <td>
                        <label className="badge badge-gradient-info">
                          Health
                        </label>
                      </td>
                      <td>April 7, 2022</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
