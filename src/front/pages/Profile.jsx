import { useEffect, useMemo, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

import { UserCard } from "../components/UserCard.jsx";
import { UserInfo } from "../components/UserInfo.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { getUserByToken, getSignings, getContracts, getPayrolls, toggleStatus, getDocumentTypes, uploadDocument, getAllSignTypes } from "../services/APIServices.js";
import workedHours from "../components/workedHours.jsx";
import SolicitudVacaciones from "../components/SolicitudVacaciones.jsx";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const token = localStorage.getItem("token");

  const [contractFile, setContractFile] = useState(null);
  const [contractType, setContractType] = useState("");
  const [payrollFile, setPayrollFile] = useState(null);
  const [payrollType, setPayrollType] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);


  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getDocumentTypes(token);
        setDocumentTypes(types);
      } catch (err) {
        console.error("Error cargando tipos de documento:", err);
      }
    };
    fetchTypes();
  }, [token]);


  const handleUpload = async (file, typeId, isContract = true) => {
    if (!file || !typeId) return alert("Selecciona un archivo y tipo");

    console.log("Subiendo archivo", file.name, "tipo:", typeId);

    try {
      const uploaded = await uploadDocument(store.user.id, token, file, typeId);

      if (isContract) {
        dispatch({
          type: "GET_CONTRACTS",
          payload: [...store.userContracts, uploaded],
        });
        setContractFile(null);
        setContractType("");
      } else {
        dispatch({
          type: "GET_PAYROLLS",
          payload: [...store.payrolls, uploaded],
        });
        setPayrollFile(null);
        setPayrollType("");
      }

    } catch (err) {
      console.error("Error subiendo documento:", err);
      alert(err.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserByToken();
        if (!user?.id) throw new Error("Usuario inválido");
        dispatch({ type: "SET_USER", payload: user });

        const signings = await getSignings(user.id, token);
        dispatch({ type: "GET_SIGNINGS", payload: Array.isArray(signings) ? signings : [] });

        const contracts = await getContracts(user.id, token);
        dispatch({ type: "GET_CONTRACTS", payload: Array.isArray(contracts) ? contracts : [] });

        const payrolls = await getPayrolls(user.id, token);
        dispatch({ type: "GET_PAYROLLS", payload: Array.isArray(payrolls) ? payrolls : [] });

      } catch (err) {
        console.error("Error cargando datos:", err);

      }
    };
    fetchData();
  }, [dispatch, token]);

  const hours = useMemo(() => workedHours(store.signings || []), [store.signings]);
  const hoursToday = hours.hoursToday;
  const hoursWeek = hours.hoursWeek;


  const handleBreakClick = async () => {
    if (!store.user?.id) return;
    try {
      const updated = await toggleBreak(store.user.id, token);
      dispatch({ type: "SET_USER", payload: updated.user });
    } catch (err) {
      console.error("Error cambiando estado de descanso:", err);
    }
  };

  if (!store.user || Object.keys(store.user).length === 0) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ff7b00", minHeight: "100vh", color: "white" }}>

        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ backgroundColor: "#ff7b00", minHeight: "100vh", color: "white", padding: "2rem" }}>
      <div className="row g-4">
        {/* Perfil */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white shadow-sm p-4 text-center border border-secondary">
            <img src={rigoImageUrl} alt="User" className="rounded-circle mx-auto mb-3" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
            <h5 className="mb-1">{store.user.first_name} {store.user.surname} {store.user.last_name}</h5>
            <p className="mb-1">Rol: {store.user.rol || "No definido"}</p>
            <p className="mb-1">DNI: {store.user.DNI || "N/A"}</p>
            <p className="mb-1">Dirección: {store.user.address || "N/A"}</p>
            <p className="mb-3">IBAN: {store.user.IBAN || "N/A"}</p>
            <p className="small">📧 {store.user.email}</p>
          </div>
        </div>


        <div className="col-lg-8">
          {/* Turno */}
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold">Turn</h6>
            <p className="fw-semibold" style={{ color: "#ff7b00" }}>Estado: Activo</p>
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
            <button className="btn w-100 text-white" style={{ backgroundColor: "#ff7b00" }} onClick={handleBreakClick}>Start / End Break</button>
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h4 className="ms-4 text-light">SIGNINGS</h4>
            <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
              {store.signings.length ? (
                store.signings.map((c) => (
                  <UserCard
                    sign_id = {c.id}
                    key = {c.id}
                    latitude={c.lat}
                    longitude={c["long"]}
                    date={c.datetime}
                    type={c.sign_type_name}
                  />
                ))
              ) : (
                <p>No signings</p>
              )}
            </ul>
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h2 className="m-2">Calendario de Horarios</h2>
            <Calendar />
          </div>
          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">

            <h6 className="fw-bold mb-3">Contracts</h6>
            {store.userContracts.length ? store.userContracts.map(c => (
              <div key={c.id} className="mb-2">
                <p className="mb-1">Contract type: <span className="fw-semibold">{c.type || "N/A"}</span></p>
                <p className="mb-1">Start date: <span className="fw-semibold">{c.start_date || "N/A"}</span></p>
              </div>
            )) : <p>No contracts</p>}

            <div className="mt-3">
              <input type="file" onChange={e => setContractFile(e.target.files[0])} />
              <select value={contractType} onChange={e => setContractType(e.target.value)}>
                <option value="">Selecciona tipo</option>
                  {documentTypes
                    .filter(t => ["contract"].includes(t.name.toLowerCase()))
                    .map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
              </select>
              <button className="btn btn-warning ms-2" onClick={() => handleUpload(contractFile, contractType, true)}>Subir contrato</button>
            </div>
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold mb-3">Payrolls</h6>
            {store.payrolls.length ? store.payrolls.map(p => (
              <div key={p.id} className="mb-2">
                <p className="mb-1">Month: <span className="fw-semibold">{p.month}</span></p>
                <p className="mb-1">Amount: <span className="fw-semibold">{p.amount}</span></p>
              </div>
            )) : <p>No payrolls</p>}

            <div className="mt-3">
              <input type="file" onChange={e => setPayrollFile(e.target.files[0])} />
              <select value={payrollType} onChange={e => setPayrollType(e.target.value)}>
                <option value="">Selecciona tipo</option>
                {documentTypes
                  .filter(t => ["payroll"].includes(t.name.toLowerCase()))
                  .map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
              </select>
              <button className="btn btn-warning ms-2" onClick={() => handleUpload(payrollFile, payrollType, false)}>Subir nómina</button>
            </div>
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
