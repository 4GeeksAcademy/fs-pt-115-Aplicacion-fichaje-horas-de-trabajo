import { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";

export const Home = () => {
  return (
    <>
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          <div className="col-md-3 row border rounded shadow-sm my-4 p-3 bg-dark d-flex flex-column align-items-center justify-self-center h-auto">
            <img
              src={rigoImageUrl}
              className="rounded-circle ms-auto me-auto mt-2 mb-2 d-flex"
              style={{ width: "180px", height: "180px", objectFit: "cover" }}
              alt="User"
            />
            <h4 className="text-light d-flex justify-content-start mt-3">
              Información adicional o lo que quieras aquí  Información
            </h4>
          </div>

          <div className="col-md-8 offset-md-1 border rounded shadow-sm my-4 p-3 bg-dark">
            <div className="row">


          <div className="mb-4 p-3 bg-dark d-flex justify-content-center align-items-center">
            
            <button className="btn btn-success rounded-circle m-2" style={{width: "120px",height: "120px"}}>Add worker</button>

            <button className="btn btn-primary rounded-circle m-2" style={{width: "120px",height: "120px"}}>Clock in</button>
            <button className="btn btn-danger rounded-circle m-2" style={{width: "120px",height: "120px"}}>Clock out</button>
          </div>



          <div className=" input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">Search Worker</span>
          <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
          
          <div className="col-md-12 table-responsive bg-dark text-white p-2">
                  <table className="table table-dark align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>First name</th>
                        <th>Total hours</th>
                        <th>Break hours</th>
                        <th>Regular hours</th>
                        <th>Overtime</th>
                        <th>Absence</th>
                      </tr>
                    </thead>
                    <tbody>{/* Agregar aquí el componente UserInfo */}</tbody>
                  </table>
                </div>
          </div>

          <hr className="border border-secondary border-1 opacity-100 my-4"/>

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
    </>
  );
};
