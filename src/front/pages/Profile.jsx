import { useEffect, useMemo, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useParams } from "react-router-dom";
import { UserCard } from "../components/UserCard.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { getUserByToken, getSignings, getContracts, getPayrolls, getDocumentTypes, uploadDocument, getUsuarioById, uploadProfileImage } from "../services/APIServices.js";
import workedHours from "../components/workedHours.jsx";
import SolicitudVacaciones from "../components/SolicitudVacaciones.jsx";
import { ClockInButton } from "../components/ClockInButton.jsx";
import { EditUserModal } from "../components/EditUserModal.jsx";

export const Profile = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [profileUser, setProfileUser] = useState(null);
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("signings");
  const [loading, setLoading] = useState(true);
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

    try {
      const uploaded = await uploadDocument(profileUser.id, token, file, typeId);

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

  const handleProfileImageUpload = async (file) => {
    if (!file) return;
    try {
      const result = await uploadProfileImage(profileUser.id, token, file);
      dispatch({ type: "UPDATE_PROFILE_IMAGE", payload: { profile_image: result.profile_image } });
      setProfileUser({ ...profileUser, profile_image: result.profile_image });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      let user = null;

      if (id) {
        console.log("Buscando usuario por id desde la URL:", id);
        user = await getUsuarioById(id, token);
      } else {
        console.log(" Buscando usuario desde token");
        user = await getUserByToken(token);
        dispatch({ type: "SET_USER", payload: user });
      }

      if (!user || !user.id) {
        console.error("❌ Usuario no encontrado o sin ID:", user);
        return;
      }

      console.log("Usuario cargado:", user);
      setProfileUser(user);

      const signings = await getSignings(user.id, dispatch);
      console.log("Signings recibidos:", signings);


      const contracts = await getContracts(user.id, token);
      console.log("Contracts recibidos:", contracts);
      dispatch({
        type: "GET_CONTRACTS",
        payload: Array.isArray(contracts) ? contracts : [],
      });

      const payrolls = await getPayrolls(user.id, token);
      console.log("Payrolls recibidos:", payrolls);
      dispatch({
        type: "GET_PAYROLLS",
        payload: Array.isArray(payrolls) ? payrolls : [],
      });


    } catch (err) {
      console.error("🔥 Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token]);

  const hours = useMemo(() => workedHours(store.signings || []), [store.signings]);
  const hoursTodayFormatted = hours.hoursToday;
  const hoursMonthFormatted = hours.hoursMonth;

  if (!profileUser) {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", color: "black" }}
      >
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="row g-4 mt-1 d-flex justify-content-center">
        <div className="col-lg-3">
          <div className="card bg-dark text-white shadow-sm p-4 text-center border border-secondary">
            <button
              className="btn btn-sm btn-outline-light position-absolute top-0 start-0 m-2"
              data-bs-toggle="modal"
              data-bs-target="#editUserModal"
              title="Editar usuario">
              <i className="fas fa-pencil-alt"></i>
            </button>
            <EditUserModal />
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                style={{ display: "none" }}
                onChange={(e) => handleProfileImageUpload(e.target.files[0])}
              />

              <label htmlFor="profileImageInput" style={{ cursor: "pointer" }}>
                <img
                  src={profileUser?.profile_image || "https://static.thenounproject.com/png/881504-200.png"}
                  alt="User"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </label>
            </div>

            <h5 className="mb-1">
              {profileUser.first_name} {profileUser.surname} {profileUser.last_name}
            </h5>
            <p className="mb-1">Rol: {profileUser.rol || "No definido"}</p>
            <p className="mb-1">DNI: {profileUser.DNI || "N/A"}</p>
            <p className="mb-1">Adress: {profileUser.address || "N/A"}</p>
            <p className="mb-3">IBAN: {profileUser.iban || "N/A"}</p>
            <p className="small">📧 {profileUser.email}</p>
          </div>

          <div className="container my-4">
            <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
              <h6 className="fw-bold mb-3">Contracts</h6>
              {store.userContracts.length ? (
                store.userContracts.map(c => (
                  <div key={c.id} className="mb-3 p-3 bg-secondary rounded">
                    <div className="row">
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <p className="mb-1">Contract type: <span className="fw-semibold">{c.type || "N/A"}</span></p>
                      </div>
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <p className="mb-1">Start date: <span className="fw-semibold">{c.start_date || "N/A"}</span></p>
                      </div>
                      <div className="col-12 col-md-4">
                        {c.file_url && (
                          <a
                            href={`data:application/pdf;base64,${c.file_url}`}
                            download={`contract_${c.id}.pdf`}
                            className="text-info"
                          >
                            Read / Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No contracts</p>
              )}

              {store.user?.is_admin && (
                <div className="mt-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-12 col-md-4">
                      <input className="form-control" type="file" onChange={e => setContractFile(e.target.files[0])} />
                    </div>
                    <div className="col-12 col-md-4">
                      <select
                        className="form-select"
                        value={contractType}
                        onChange={e => setContractType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {documentTypes
                          .filter(t => t.name.toLowerCase() === "contract")
                          .map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <button
                        className="btn btn-warning w-100"
                        onClick={() => handleUpload(contractFile, contractType, true)}
                      >
                        Upload Contract
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
              <h6 className="fw-bold mb-3">Payrolls</h6>
              {store.payrolls.length ? (
                store.payrolls.map(p => (
                  <div key={p.id} className="mb-3 p-3 bg-secondary rounded">
                    <div className="row">
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <p className="mb-1">Month: <span className="fw-semibold">{p.month}</span></p>
                      </div>
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <p className="mb-1">Amount: <span className="fw-semibold">{p.amount}</span></p>
                      </div>
                      <div className="col-12 col-md-4">
                        {p.file_url && (
                          <a
                            href={`data:application/pdf;base64,${p.file_url}`}
                            download={`payroll_${p.id}.pdf`}
                            className="text-info"
                          >
                            Read / Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No payrolls</p>
              )}

              {store.user?.is_admin && (
                <div className="mt-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-12 col-md-4">
                      <input className="form-control" type="file" onChange={e => setPayrollFile(e.target.files[0])} />
                    </div>
                    <div className="col-12 col-md-4">
                      <select
                        className="form-select"
                        value={payrollType}
                        onChange={e => setPayrollType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {documentTypes
                          .filter(t => t.name.toLowerCase() === "payroll")
                          .map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <button
                        className="btn btn-warning w-100"
                        onClick={() => handleUpload(payrollFile, payrollType, false)}
                      >
                        Upload Payroll
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold mb-3">Vacation Requests</h6>
            <button
              className="btn w-100 text-dark"
              style={{ backgroundColor: "#FF7B00" }}
              onClick={() => setShowHolidayForm(true)}
            >
              <strong>New Request</strong>
            </button>
          </div>

          <SolicitudVacaciones
            show={showHolidayForm}
            onClose={() => setShowHolidayForm(false)}
          />
        </div>

        <div className="col-lg-7">

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h6 className="fw-bold">
              Turn: {profileUser.status_id == 1 ? "Active" : "Unavailable"}
            </h6>
            <p className="fw-semibold" style={{ color: "#ff7b00" }}></p>
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
            <ClockInButton onClockIn={() => fetchData()} />
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <div className="flex border-b border-secondary mb-3">
              <button
                className={`px-4 py-2 bg-dark text-sm ${activeTab === "signings" ? "border-b-2 border-info text-info" : "text-light"
                  }`}
                onClick={() => setActiveTab("signings")}
              >
                SIGNINGS
              </button>
              <button
                className={`px-4 py-2 bg-dark text-sm ${activeTab === "historic" ? "border-b-2 border-info text-info" : "text-light"
                  }`}
                onClick={() => setActiveTab("historic")}
              >
                HISTORIC SIGNINGS
              </button>
            </div>

            {activeTab === "signings" && (
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {loading ? (
                  <p>Cargando signings...</p>
                ) : store.signings.length ? (
                  store.signings.map((c) => (
                    <UserCard
                      sign_id={c.id}
                      key={c.id}
                      latitude={c.lat}
                      longitude={c["long"]}
                      date={c.datetime}
                      type={c.sign_type_name}
                      user={profileUser}
                      isHistoric={false}
                      image={profileUser?.profile_image || "https://static.thenounproject.com/png/881504-200.png"}

                    />
                  ))
                ) : (
                  <p>No signings</p>
                )}
              </ul>
            )}

            {activeTab === "historic" && (
              <ul className="p-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
                {loading ? (
                  <p>Cargando históricos...</p>
                ) : store.historicSignings?.length ? (
                  store.historicSignings.map((o) => (
                    <UserCard
                      sign_id={o.id}
                      key={o.id}
                      latitude={o.lat}
                      longitude={o["long"]}
                      date={o.datetime}
                      type={o.sign_type_name}
                      user={profileUser}
                      isHistoric={true}
                      image={profileUser?.profile_image || "https://static.thenounproject.com/png/881504-200.png"}
                    />
                  ))
                ) : (
                  <p>No historic signings</p>
                )}
              </ul>
            )}
          </div>

          <div className="card mb-4 p-4 bg-dark text-white border border-secondary">
            <h2 className="m-2">Schedule</h2>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};