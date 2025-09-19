import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";
import { UserInfo } from "../components/UserInfo.jsx";
import { getUsuarios } from "../services/APIServices.js";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsuarios(dispatch).catch((err) => console.error(err));
  }, [dispatch]);

  const workers = store.users || [];

  const filteredWorkers = workers.filter((w) =>
    w.first_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
<<<<<<< HEAD
    <>
      <div className="container-fluid d-flex justify-content-center mt-5">
        <div className="row">
          {/* <div className="col-md-3 ms-1 row border rounded shadow-sm my-4 p-3 bg-dark d-flex flex-column align-items-center justify-self-center h-auto">
            <img
              src={rigoImageUrl}
              className="rounded-circle ms-auto me-auto mt-2 mb-2 d-flex"
              style={{ width: "180px", height: "180px", objectFit: "cover" }}
              alt="User"
=======
    <div className="container-fluid d-flex justify-content-center">
      <div className="row">
        <div className="col-md-10 offset-md-1 border rounded shadow-sm my-4 p-3 bg-dark">
          {/* Botones */}
          <div className="mb-4 p-3 bg-dark d-flex justify-content-center align-items-center">
            <button
              className="btn btn-success rounded-circle m-2"
              style={{ width: "120px", height: "120px" }}
            >
              Add worker
            </button>
            <button
              className="btn btn-primary rounded-circle m-2"
              style={{ width: "120px", height: "120px" }}
            >
              Clock in
            </button>
            <button
              className="btn btn-danger rounded-circle m-2"
              style={{ width: "120px", height: "120px" }}
            >
              Clock out
            </button>
          </div>


          <div className="input-group input-group-sm mb-3">
            <span className="input-group-text">Search Worker</span>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a name..."
>>>>>>> develop
            />
          </div>

          <div className="col-md-12 bg-dark text-white p-2">
            <div className="table-responsive" style={{ maxHeight: "250px", overflowY: "auto" }}>
              <table className="table table-dark align-middle mb-0">
                <thead
                  className="table-dark"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "#212529",
                  }}
                >
                  <tr>
                    <th>First name</th>
                    <th className="text-end">Total hours</th>
                    <th className="text-end">Break hours</th>
                    <th className="text-end">Regular hours</th>
                    <th className="text-end">Overtime</th>
                    <th className="text-end">Absence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((w, index) => (
                    <UserInfo
                      key={index}
                      firstName={w.first_name}
                      totalHours={w.total_hours ?? 0}
                      breakHours={w.break_hours ?? 0}
                      regularHours={w.regular_hours ?? 0}
                      overtime={w.overtime ?? 0}
                      absence={w.absence ?? 0}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">WORKING</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                <UserCard />
              </ul>
            </div>
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">NOT WORKING</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                <UserCard />
              </ul>
            </div>
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">BREAK</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                <UserCard />
              </ul>
            </div>
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">HOLIDAYS</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                <UserCard />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
