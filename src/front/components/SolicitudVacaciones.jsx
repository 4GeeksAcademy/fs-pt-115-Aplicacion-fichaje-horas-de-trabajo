import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"; 
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from "../services/APIServices";

export default function SolicitudVacaciones({ show, onClose }) {
  const { store, dispatch } = useGlobalReducer();
  const holidays = store.holidays;
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    horas: "",
    tipo: "",
    descripcion: "",
    adminMessage: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filtrar solo las solicitudes del usuario logueado
  const userHolidays = holidays.filter(h => h.user.id === store.user.id);

  useEffect(() => {
    if (!show) return;
    const fetchHolidays = async () => {
      try {
        const data = await getHolidays();
        dispatch({ type: "GET_HOLIDAYS", payload: data });
      } catch (err) {
        console.error("Error al cargar las solicitudes:", err);
      }
    };
    fetchHolidays();
  }, [show, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const updated = await updateHoliday(editingId, { ...formData });
        dispatch({ type: "UPDATE_HOLIDAY", payload: updated });
        setEditingId(null);
      } else {
        const created = await createHoliday(formData);
        dispatch({ type: "ADD_HOLIDAY", payload: { ...created, status: "pendiente", adminMessage: "" } });
      }

      setFormData({
        fechaInicio: "",
        fechaFin: "",
        horas: "",
        tipo: "",
        descripcion: "",
        adminMessage: "",
        status: "",
      });

      onClose();
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (holiday) => {
    setEditingId(holiday.id);
    setFormData({
      fechaInicio: holiday.fechaInicio,
      fechaFin: holiday.fechaFin,
      horas: holiday.horas || "",
      tipo: holiday.tipo,
      descripcion: holiday.descripcion || "",
      adminMessage: holiday.adminMessage || "",
      status: holiday.status || "pendiente",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta solicitud?")) return;
    try {
      await deleteHoliday(id);
      dispatch({ type: "DELETE_HOLIDAY", payload: id });
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? "Edit Request" : "New Request"}</h5>
            <button type="button" className="btn-close bg-danger" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {userHolidays.length > 0 && (
              <ul className="list-group mb-3">
                {userHolidays.map(h => (
                  <li key={h.id} className="list-group-item d-flex flex-column justify-content-between align-items-start">
                    <div className="d-flex justify-content-between w-100">
                      <span>
                        <strong>Since:</strong> {h.fechaInicio} |{" "}
                        <strong>To:</strong> {h.fechaFin} |{" "}
                        <strong>Type:</strong> {h.tipo} |{" "}
                        <strong>State:</strong>{" "}
                        {h.status === "pendiente" ? "⏳ Pending" : h.status === "aprobado" ? "✅ Aproved" : "❌ Rejected"}
                      </span>
                      <span>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(h)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(h.id)}>Delete</button>
                      </span>
                    </div>
                    {h.adminMessage && (
                      <small className="text-info mt-1"><strong>Admin Message:</strong> {h.adminMessage}</small>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-3">
              <label className="form-label">Since</label>
              <input type="date" name="fechaInicio" className="form-control" value={formData.fechaInicio} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">To</label>
              <input type="date" name="fechaFin" className="form-control" value={formData.fechaFin} onChange={handleChange} />
            </div>

            {/* <div className="mb-3">
              <label className="form-label">Horas (opcional)</label>
              <input type="time" name="horas" className="form-control" value={formData.horas} onChange={handleChange} />
            </div> */}

            <div className="mb-3">
              <label className="form-label">Request Type</label>
              <select name="tipo" className="form-select" value={formData.tipo} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="vacaciones">Holidays</option>
                <option value="incidencias">Incidents</option>
                <option value="permiso_retribuido">Paid Leave</option>
                <option value="permiso_no_retribuido">Unpaid Leave</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="descripcion" rows="3" className="form-control" value={formData.descripcion} onChange={handleChange} placeholder="Request description..." />
            </div>

            {store.user.is_admin && editingId && (
              <>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="pendiente">⏳ Pending</option>
                    <option value="aprobado">✅ Aproved</option>
                    <option value="rechazado">❌ Rejected</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Admin Message</label>
                  <textarea name="adminMessage" rows="2" className="form-control" value={formData.adminMessage} onChange={handleChange} placeholder="A message for the user..." />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : editingId ? "Save changes" : "Send Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
