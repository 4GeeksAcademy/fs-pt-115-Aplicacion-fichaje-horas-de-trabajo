import { useEffect, useMemo, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";
import { UserInfo } from "../components/UserInfo.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { getUserByToken, getSignings, getContracts, getPayrolls, toggleBreak } from "../services/APIServices.js";
import workedHours from "../components/workedHours.jsx";
import SolicitudVacaciones from "../components/SolicitudVacaciones.jsx";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const token = localStorage.getItem("token");

  const handleBreak = async () => {
    try {
      const updated = await toggleBreak(store.user.id, token);
      dispatch({ type: "SET_USER", payload: updated.user });
    } catch (err) {
      console.error("Error cambiando estado de descanso:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserByToken();
        dispatch({ type: "SET_USER", payload: user });

        const signings = await getSignings(user.id);
        dispatch({ type: "GET_SIGNINGS", payload: signings });

        const contracts = await getContracts(user.id);
        dispatch({ type: "GET_CONTRACTS", payload: contracts });

        const payrolls = await getPayrolls(user.id, token);
        dispatch({ type: "GET_PAYROLLS", payload: payrolls });
      } catch (err) {
        console.error("Error cargando datos del perfil:", err);
      }
    };
    fetchData();
  }, [dispatch, token]);

  const hours = useMemo(() => workedHours(store.signings || []), [store.signings]);
  const hoursToday = hours.hoursToday;
  const hoursWeek = hours.hoursWeek;

  if (!store.user || Object.keys(store.user).length === 0) {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#ff7b00", minHeight: "100vh", color: "white" }}
      >
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: "#ff7b00", minHeight: "100vh", color: "white", padding: "2rem" }}
    >
      <div className="row g-4">
        {/* Columna de usuario */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white shadow-sm p-4 text-center border border-secondary">
            <img
              src={rigoImageUrl}
              alt="User"
              className="rounded-circle mx-auto mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <h5 className="mb-1">
              {store.user.first_name} {store.user.surname} {store.user.last_name}
            </h5>
            <p className="text-muted mb-1">Rol: {store.user.rol || "No definido"}</p>
            <p className="text-muted mb-1">DNI: {store.user.DNI || "N/A"}</p>
            <p className="text-muted mb-1">Dirección: {store.user.address || "N/A"}</p>
            <p className="text-muted mb-3">IBAN: {store.user.iban || "N/A"}</p>
            <p className="small text-white">📧 {store.user.email}</p>
          </div>
        </div>

        {/* Columna de información */}
        <div className="col-lg-8">
          {/* Turn */}
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold">Turn</h6>
            <p className="fw-semibold" style={{ color: "#ff7b00" }}>
              Estado: Activo
            </p>
            <div className="d-flex justify-content-between my-3">
              <div>
                <small className="text-muted">Hours today</small>
                <h4 className="fw-bold" style={{ color: "#ff7b00" }}>{hoursToday}</h4>
              </div>
              <div>
                <small className="text-muted">Hours this week</small>
                <h4 className="fw-bold" style={{ color: "#ff7b00" }}>{hoursWeek}</h4>
              </div>
            </div>
            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: "#ff7b00" }}
              onClick={handleBreak}
            >
              Start / End Break
            </button>
          </div>

          {/* Contracts */}
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h2 className="m-2">Calendario de Horarios</h2>
            <Calendar/>
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold mb-3">Contracts</h6>
            {store.userContracts.length ? (
              store.userContracts.map((c) => (
                <div key={c.id} className="mb-2">
                  <p className="mb-1">
                    Contract type: <span className="fw-semibold">{c.type || "N/A"}</span>
                  </p>
                  <p className="mb-1">
                    Start date: <span className="fw-semibold">{c.start_date || "N/A"}</span>
                  </p>
                </div>
              ))
            ) : (
              <p>No contracts</p>
            )}
          </div>

          {/* Payrolls */}
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold mb-3">Payrolls</h6>
            {store.payrolls.length ? (
              store.payrolls.map((p) => (
                <div key={p.id} className="mb-2">
                  <p className="mb-1">
                    Month: <span className="fw-semibold">{p.month}</span>
                  </p>
                  <p className="mb-1">
                    Amount: <span className="fw-semibold">{p.amount}</span>
                  </p>
                </div>
              ))
            ) : (
              <p>No payrolls</p>
            )}
          </div>

          {/* Vacations */}
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold mb-3">Vacation Requests</h6>
            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: "#ff7b00" }}
              onClick={() => setShowHolidayForm(true)}
            >
              Nueva Solicitud
            </button>
          </div>

          {/* Modal controlado por React */}
          <SolicitudVacaciones
            show={showHolidayForm}
            onClose={() => setShowHolidayForm(false)}
          />
        </div>
      </div>
    </div>
  );
};



