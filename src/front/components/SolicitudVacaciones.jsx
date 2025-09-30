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
            <h5 className="modal-title">{editingId ? "Editar Solicitud" : "Nueva Solicitud"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {userHolidays.length > 0 && (
              <ul className="list-group mb-3">
                {userHolidays.map(h => (
                  <li key={h.id} className="list-group-item d-flex flex-column justify-content-between align-items-start">
                    <div className="d-flex justify-content-between w-100">
                      <span>
                        <strong>Desde:</strong> {h.fechaInicio} |{" "}
                        <strong>Hasta:</strong> {h.fechaFin} |{" "}
                        <strong>Tipo:</strong> {h.tipo} |{" "}
                        <strong>Estado:</strong>{" "}
                        {h.status === "pendiente" ? "⏳ Pendiente" : h.status === "aprobado" ? "✅ Aprobado" : "❌ Rechazado"}
                      </span>
                      <span>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(h)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(h.id)}>Eliminar</button>
                      </span>
                    </div>
                    {h.adminMessage && (
                      <small className="text-info mt-1"><strong>Mensaje del admin:</strong> {h.adminMessage}</small>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-3">
              <label className="form-label">Desde</label>
              <input type="date" name="fechaInicio" className="form-control" value={formData.fechaInicio} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Hasta</label>
              <input type="date" name="fechaFin" className="form-control" value={formData.fechaFin} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Horas (opcional)</label>
              <input type="time" name="horas" className="form-control" value={formData.horas} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de solicitud</label>
              <select name="tipo" className="form-select" value={formData.tipo} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="vacaciones">Vacaciones</option>
                <option value="incidencias">Incidencias</option>
                <option value="permiso_retribuido">Permiso Retribuido</option>
                <option value="permiso_no_retribuido">Permiso No Retribuido</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" rows="3" className="form-control" value={formData.descripcion} onChange={handleChange} placeholder="Escribe detalles de la solicitud..." />
            </div>

            {/* Solo admin puede modificar status y adminMessage */}
            {store.user.is_admin && editingId && (
              <>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="aprobado">✅ Aprobado</option>
                    <option value="rechazado">❌ Rechazado</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje del admin</label>
                  <textarea name="adminMessage" rows="2" className="form-control" value={formData.adminMessage} onChange={handleChange} placeholder="Escribe un mensaje para el usuario..." />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Procesando..." : editingId ? "Guardar cambios" : "Enviar solicitud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
