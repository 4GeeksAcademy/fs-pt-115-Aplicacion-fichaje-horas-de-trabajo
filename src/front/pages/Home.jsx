import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";
import { UserInfo } from "../components/UserInfo.jsx";
import { getUsuarios, getSignings } from "../services/APIServices.js";
import { comproveAuth } from "../components/ExpTokenFunction.jsx";
import { UsersTable } from "../components/UsersTable.jsx";
import { ClockInButton } from "../components/ClockInButton.jsx";
import workedHours, {formatHours} from "../components/workedHours.jsx";
import { ButtonCard } from "../components/ButtonCard.jsx";
export const Home = () => {

  const { store, dispatch } = useGlobalReducer();
  const [search, setSearch] = useState("");

  comproveAuth();

  useEffect(() => {
    const fetchUsersWithSignings = async () => {
    try {
      const users = await getUsuarios(dispatch);
      const usersWithSignings = await Promise.all(
        users.map(async (user) => {
          const signings = await getSignings(user.id, localStorage.getItem("token"));
          return { ...user, signings: Array.isArray(signings) ? signings : [] };
        })
      );
      dispatch({ type: "GET_USERS", payload: usersWithSignings });
    } catch (err) {
      console.error(err);
    }
  };

  fetchUsersWithSignings();
}, [dispatch]);

  const workers = store.users || [];

  const filteredWorkers = workers.filter((w) =>
    w.first_name.toLowerCase().includes(search.toLowerCase())
  );

  const usersWithHours = filteredWorkers.map(user => {
  const hours = workedHours(user.signings || []);
  return {
    ...user,
    total_hours: formatHours(hours.hoursWeek),
    regular_hours: formatHours(hours.hoursToday),
    break_hours: "0h 0m",
    overtime: "0h 0m",
    absence: "0h 0m"
  };
});


  return (
    <div className="container-fluid d-flex justify-content-center">
      <div className="row col-9">
        <div className="col-md-10 offset-md-1 border rounded shadow-sm my-4 p-3 bg-dark">
          <div className="mb-4 p-3 bg-dark d-flex justify-content-center align-items-center">

            <ClockInButton/>

          </div>


          <div className="input-group input-group-sm mb-3">
            <span className="input-group-text">Search Worker</span>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a name..."
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
                    <UsersTable users={usersWithHours} isAdmin={store.user?.is_admin ?? false}                    
                    />
                </tbody>
              </table>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">WORKING</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {store.users.length ? (
                  store.users
                    .filter((c) => c.status_id === 1)
                    .map((c) => (
                      <ButtonCard
                        id={c.id}
                        key={c.id}
                        name={c.first_name}
                        rol={c.rol}
                        state={"Activo"}
                      />
                    ))
                ) : (
                  <p>No users in this state.</p>
                )}
              </ul>
            </div>
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">NOT WORKING</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {store.users.length ? (
                  store.users
                    .filter((c) => c.status_id === 2)
                    .map((c) => (
                      <ButtonCard
                        id={c.id}
                        key={c.id}
                        name={c.first_name}
                        rol={c.rol}
                        state={"Inactivo"}
                      />
                    ))
                ) : (
                  <p>No users in this state.</p>
                )}
              </ul>
            </div>
            {/* <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">BREAK</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {store.users.length ? (
                  store.users
                    .filter((c) => c.status_id === 3)
                    .map((c) => (
                      <ButtonCard
                        id={c.id}
                        key={c.id}
                        name={c.first_name}
                        rol={c.rol}
                        state={"En Descanso"}
                      />
                    ))
                ) : (
                  <p>No users in this state.</p>
                )}
              </ul>
            </div>
            <div className="col-md-6 mb-4">
              <h4 className="ms-4 text-light">HOLIDAYS</h4>
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {store.users.length ? (
                  store.users
                    .filter((c) => c.status_id === 4)
                    .map((c) => (
                      <ButtonCard
                        id={c.id}
                        key={c.id}
                        name={c.first_name}
                        rol={c.rol}
                        state={"De Vacaciones"}
                      />
                    ))
                ) : (
                  <p>No users in this state.</p>
                )}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
