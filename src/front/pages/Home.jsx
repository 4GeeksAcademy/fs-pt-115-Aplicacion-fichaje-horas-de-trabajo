import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Login } from "../components/Login.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";

export const Home = () => {
  return (
<div className="container-fluid d-flex justify-content-center">
    <div className="row">

      <div className="col-md-3 row border rounded shadow-sm my-4 p-3 bg-dark d-flex flex-column align-items-center">
        <img
          src={rigoImageUrl}
          className="rounded-circle ms-auto me-auto mt-2 mb-2 d-flex"
          style={{ width: "180px", height: "180px", objectFit: "cover" }}
          alt="User"
        />
        <h4 className="text-light d-flex justify-content-start mt-3">Información adicional o lo que quieras aquí</h4>

      </div>
      <div className="col-md-8 offset-md-1 border rounded shadow-sm my-4 p-3 bg-dark">
        <div className="row">

          <div className="col-md-6 mb-4">
            <h4 className="ms-4 text-light">WORKING</h4>
            <ul className="p-2">
            <UserCard />
            <UserCard />
            <UserCard />
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h4 className="ms-4 text-light">NOT WORKING</h4>
            <ul className="p-2">
            <UserCard />
            <UserCard />
            <UserCard />
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h4 className="ms-4 text-light">BREAK</h4>
            <ul className="p-2">
            <UserCard />
            <UserCard />
            <UserCard />
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h4 className="ms-4 text-light">HOLIDAYS</h4>
            <ul className="p-2">
            <UserCard />
            <UserCard />
            <UserCard />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
