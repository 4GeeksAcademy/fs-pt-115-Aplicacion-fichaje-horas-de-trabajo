import { useEffect, useState, useMemo } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getUsuarios, getSignings, getprofileimage } from "../services/APIServices.js";
import { comproveAuth } from "../components/ExpTokenFunction.jsx";
import { UsersTable } from "../components/UsersTable.jsx";
import { ClockInButton } from "../components/ClockInButton.jsx";
import calculateWorkedHours from "../components/workedHours.jsx";
import { ButtonCard } from "../components/ButtonCard.jsx";
import workedHours from "../components/workedHours.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [profileImage, setProfileImage] = useState("");

  comproveAuth();


  const normalizarSignings = (signings = []) =>
    signings.map((s) => ({
      ...s,
      sign_type_name: s.sign_type_name || (s.sign_type_id === 1 ? "in" : "out"),
    }));

  const fetchUsersWithSignings = async () => {
    try {
      const users = await getUsuarios(dispatch);

      const usersWithData = await Promise.all(
        users.map(async (user) => {
          const signings = await getSignings(user.id, dispatch);
          return {
            ...user,
            signings: Array.isArray(signings) ? normalizarSignings(signings) : [],
          };
        })
      );

      dispatch({ type: "GET_USERS", payload: usersWithData });

      if (store.user?.id) {
        const image = await getprofileimage(store.user.id, dispatch);
        setProfileImage(image);
      }


      const currentUser = usersWithData.find((u) => u.id === store.user?.id);
      if (currentUser) {
        dispatch({ type: "GET_SIGNINGS", payload: currentUser.signings });

        const { hoursToday, hoursMonth } = calculateWorkedHours(currentUser.signings);
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
          },
        });
      }
    } catch (err) {
      console.error("Error en fetchUsersWithSignings:", err);
    }
  };

  const workers = store.users || [];
  const filteredWorkers = workers.filter((w) =>
    w.first_name.toLowerCase().includes(search.toLowerCase())
  );

  const hours = useMemo(() => workedHours(store.signings || []), [store.signings]);
  const hoursTodayFormatted = hours.hoursToday;
  const hoursMonthFormatted = hours.hoursMonth;

  const usersWithHours = filteredWorkers.map((user) => {
    const { hoursToday, hoursMonth } = calculateWorkedHours(user.signings || []);
    return {
      ...user,
      total_hours: hoursMonth,
      regular_hours: hoursToday,
      month_hours: hoursMonth,
    };
  });

  useEffect(() => {
    fetchUsersWithSignings();
  }, [token, store.user?.id]);

  return (
<div className="container-fluid mt-4">
  <div className="row g-4">
    <div className="col-lg-3 d-flex justify-content-center">
      <div className="card bg-dark text-white shadow-sm p-3 text-center border border w-100" style={{ maxHeight: "400px" }}>
        <img
          src={profileImage?.profile_image || "https://static.thenounproject.com/png/881504-200.png"}
          alt="User"
          className="rounded-circle mx-auto mb-2"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <h5 className="mb-2">
          {store.user.first_name} {store.user.surname} {store.user.last_name}
        </h5>
        <p className="mb-2">Rol: {store.user.rol || "No definido"}</p>
        <p className="mb-2">DNI: {store.user.DNI || "N/A"}</p>
        <p className="mb-2">Adress: {store.user.address || "N/A"}</p>
        <p className="small">📧 {store.user.email}</p>
      </div>
    </div>

        <div className="col-12 col-lg-9">
          <div className="border rounded shadow-sm p-4 bg-dark h-100">
            <div className="card mb-4 p-4 bg-dark text-white border border">
              <h6 className="fw-bold">
                Turn: {store.user.status_id == 1 ? "Active" : "Unavailable"}
              </h6>
              <div className="d-flex justify-content-between my-3">
                <div>
                  <small>Hours today</small>
                  <h4 className="fw-bold" style={{ color: "#ff7b00" }}>{hoursTodayFormatted}</h4>
                </div>
                <div>
                  <small>Hours this Month</small>
                  <h4 className="fw-bold" style={{ color: "#ff7b00" }}>{hoursMonthFormatted}</h4>
                </div>
              </div>
              <ClockInButton onClockIn={() => fetchUsersWithSignings()} />
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
                  <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                    <tr>
                      <th>First name</th>
                      <th className="text-end">Dayli hours</th>
                      <th className="text-end">Weekly hours</th>
                      <th className="text-end">Monthly hours</th>
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
                <ul className="p-2 bg-B0B0B0 rounded" style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {store.users.length ? (
                    store.users
                      .filter((c) => c.status_id === 1)
                      .map((c) => (
                        <ButtonCard
                          id={c.id}
                          key={c.id}
                          name={c.first_name}
                          rol={c.rol}
                          state={"Active"}
                          image={c.profile_image || "https://static.thenounproject.com/png/881504-200.png"}
                        />
                      ))
                  ) : (
                    <p>No users in this state.</p>
                  )}
                </ul>
              </div>

              <div className="col-12 col-md-6 mb-4">
                <h4 className="ms-2 text-light">NOT WORKING</h4>
                <ul className="p-2 bg-B0B0B0 rounded" style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {store.users.length ? (
                    store.users
                      .filter((c) => c.status_id === 2)
                      .map((c) => (
                        <ButtonCard
                          id={c.id}
                          key={c.id}
                          name={c.first_name}
                          rol={c.rol}
                          state={"Unavailable"}
                          image={c.profile_image || "https://static.thenounproject.com/png/881504-200.png"}
                        />
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