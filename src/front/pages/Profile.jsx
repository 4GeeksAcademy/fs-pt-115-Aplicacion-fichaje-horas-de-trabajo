import { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";
import { UserInfo } from "../components/UserInfo.jsx";
import { Calendar } from "../components/Calendar.jsx";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();

  const UserActivation = store.users.find((user) => user.email === store.user.email);

  useEffect(() => {
    console.log("UserActivation:", UserActivation);
  }, [UserActivation]);

  return (
    <>
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          <div className="col-md-3 ms-1 row border rounded shadow-sm my-4 p-3 bg-dark d-flex flex-column align-items-center justify-self-center h-auto">
            <img
              src={rigoImageUrl}
              className="rounded-circle ms-auto me-auto mt-2 mb-2 d-flex"
              style={{ width: "180px", height: "180px", objectFit: "cover" }}
              alt="User"
            />
            <h4 className="text-light d-flex justify-content-start mt-3">
              {store.user.firstName + " " + store.user.lastName}
            </h4>
          </div>

          <div className="col-md-8 offset-md-1 border rounded shadow-sm my-4 p-3 bg-dark">
            <div className="row">
              <div className="mb-4 p-3 bg-dark d-flex justify-content-end align-items-center">
                {/* Admin Switch */}
                {UserActivation && UserActivation.isadmin === true ? (
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="boolSwitch" />
                    <label class="form-check-label text-light" for="boolSwitch">Is Admin</label>
                  </div>
                ) : null}

              </div>

              <div className=" input-group input-group-sm mb-3">
                <Calendar/>
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Search Worker
                </span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                />

                <div className="col-md-12 bg-dark text-white p-2">
                  <div className="table-responsive">
                    <table
                      className="table table-dark align-middle"
                      style={{ marginBottom: 0 }}
                    >
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
                          <th>Total hours</th>
                          <th>Break hours</th>
                          <th>Regular hours</th>
                          <th>Overtime</th>
                          <th>Absence</th>
                        </tr>
                      </thead>
                    </table>

                    <div
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                      }}
                    >
                      <table className="table table-dark align-middle">
                        <tbody>
                          <UserInfo firstName="HOLA" totalHours="10" breakHours="1" regularHours="9" overtime="0" absence="0" />
                          <UserInfo firstName="Juan" totalHours="12" breakHours="1" regularHours="11" overtime="1" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                          <UserInfo firstName="Ana" totalHours="8" breakHours="0.5" regularHours="7.5" overtime="0" absence="0" />
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <h4 className="ms-4 text-light">USERS</h4>

                <ul
                  className="p-2"
                  style={{
                    maxHeight: "340px",
                    overflowY: "auto",
                  }}
                >
                  <UserCard />
                  <UserCard />
                  <UserCard />
                </ul>
              </div>

              <div className="col-md-6 mb-4">
                <h4 className="ms-4 text-light">ADMINS</h4>

                <ul
                  className="p-2"
                  style={{
                    maxHeight: "340px",
                    overflowY: "auto",
                  }}
                >
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