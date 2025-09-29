import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getUsuarios, getSignings, getHistoricSignings } from "../services/APIServices.js";
import { comproveAuth } from "../components/ExpTokenFunction.jsx";
import { UsersTable } from "../components/UsersTable.jsx";
import { ClockInButton } from "../components/ClockInButton.jsx";
import calculateWorkedHours from "../components/workedHours.jsx";
import { ButtonCard } from "../components/ButtonCard.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [search, setSearch] = useState("");

  comproveAuth();

  useEffect(() => {
    const fetchUsersWithSignings = async () => {
      try {
        const token = localStorage.getItem("token");
        const users = await getUsuarios(dispatch);

        const usersWithData = await Promise.all(
          users.map(async (user) => {
            const [signings, historicSignings] = await Promise.all([
              getSignings(user.id, token),
              getHistoricSignings(user.id, token),
            ]);

            return {
              ...user,
              signings: Array.isArray(signings) ? signings : [],
              historicSignings: Array.isArray(historicSignings) ? historicSignings : [],
            };
          })
        );

        dispatch({ type: "GET_USERS", payload: usersWithData });

        const currentUser = usersWithData.find((u) => u.id === store.user?.id);
        if (currentUser) {
          const { hoursToday, hoursMonth } = calculateWorkedHours(currentUser.signings || []);

          dispatch({
            type: "SET_HOURS_DATA",
            payload: {
              hoursToday,
              hoursMonth,
              lastMonth: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                hours: hoursMonth,
              },
              history: currentUser.historicSignings || [],
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsersWithSignings();
  }, [dispatch, store.user?.id]);

  const workers = store.users || [];
  const filteredWorkers = workers.filter((w) =>
    w.first_name.toLowerCase().includes(search.toLowerCase())
  );

  const usersWithHours = filteredWorkers.map((user) => {
    const { hoursToday, hoursMonth } = calculateWorkedHours(user.signings || []);
    return {
      ...user,
      total_hours: hoursMonth,
      regular_hours: hoursToday,
      break_hours: "0h 0m",
      overtime: "0h 0m",
      absence: "0h 0m",
    };
  });

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">
        <div className="col-12 col-lg-3 d-flex justify-content-center">
          <div className="card bg-dark text-white shadow-sm p-4 text-center border border-secondary w-100">
            <img
              src={rigoImageUrl}
              alt="User"
              className="rounded-circle mx-auto mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <h5 className="mb-1">
              {store.user.first_name} {store.user.surname} {store.user.last_name}
            </h5>
            <p className="mb-1">Rol: {store.user.rol || "No definido"}</p>
            <p className="mb-1">DNI: {store.user.DNI || "N/A"}</p>
            <p className="mb-1">Dirección: {store.user.address || "N/A"}</p>
            <p className="mb-3">IBAN: {store.user.iban || "N/A"}</p>
            <p className="small">📧 {store.user.email}</p>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          <div className="border rounded shadow-sm my-4 p-4 bg-dark h-100">
            <div className="mb-4 p-3 d-flex justify-content-center align-items-center bg-dark rounded">
              <ClockInButton />
            </div>

            <div className="input-group input-group-sm mb-3">
              <span className="input-group-text bg-secondary text-white">
                Search Worker
              </span>
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a name..."
              />
            </div>

            <div className="col-12 p-2">
              <div className="table-responsive" style={{ maxHeight: "250px", overflowY: "auto" }}>
                <table className="table align-middle mb-0">
                  <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
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
                    <UsersTable users={usersWithHours} isAdmin={store.user?.is_admin ?? false} />
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 col-md-6 mb-4">
                <h4 className="ms-2 text-light">WORKING</h4>
                <ul className="p-2 bg-light rounded" style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {store.users.length ? (
                    store.users
                      .filter((c) => c.status_id === 1)
                      .map((c) => (
                        <ButtonCard id={c.id} key={c.id} name={c.first_name} rol={c.rol} state={"Activo"} />
                      ))
                  ) : (
                    <p>No users in this state.</p>
                  )}
                </ul>
              </div>

              <div className="col-12 col-md-6 mb-4">
                <h4 className="ms-2 text-light">NOT WORKING</h4>
                <ul className="p-2 bg-light rounded" style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {store.users.length ? (
                    store.users
                      .filter((c) => c.status_id === 2)
                      .map((c) => (
                        <ButtonCard id={c.id} key={c.id} name={c.first_name} rol={c.rol} state={"Inactivo"} />
                      ))
                  ) : (
                    <p>No users in this state.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};