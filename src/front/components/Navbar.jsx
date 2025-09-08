import { Link, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        {/* <Link
          to={localStorage.getItem("token") ? "/home" : "/login"}
          className="navbar-brand text-light"
        >
          Clock In
        </Link> */}
        <Link
          to="/home"
          className="navbar-brand text-light"
        >
          Clock In
          </Link>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {UserActivation && UserActivation.isadmin === true ? (
                <button className="btn btn-success m-2">Add worker</button>
              ) : null}
            </li>
            <li className="nav-item">
              {UserActivation && UserActivation.isadmin === true ? (
                <button className="btn btn-primary m-2">Requests <span class="badge text-bg-secondary">4</span></button>
              ) : null}
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
              >
                <button className="btn btn-dark m-2">My Profile</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
