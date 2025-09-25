import React, { useState, useEffect } from "react";
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from "../services/APIServices";

export default function SolicitudVacaciones({ show, onClose }) {
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    horas: "",
    tipo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Traer solicitudes al montar el componente
  useEffect(() => {
    if (!show) return; // solo cargar cuando se muestre
    const fetchHolidays = async () => {
      try {
        const data = await getHolidays();
        setHolidays(data);
      } catch (err) {
        console.error("Error al cargar las solicitudes:", err);
      }
    };
    fetchHolidays();
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const updated = await updateHoliday(editingId, formData);
        setHolidays(holidays.map(h => (h.id === editingId ? updated : h)));
        setEditingId(null);
      } else {
        const created = await createHoliday(formData);
        setHolidays([...holidays, created]);
      }
      setFormData({
        fechaInicio: "",
        fechaFin: "",
        horas: "",
        tipo: "",
        descripcion: "",
      });
      onClose(); // cerrar modal después de enviar
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      // 🔹 Ya no mostramos alerta de error
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
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta solicitud?")) return;
    try {
      await deleteHoliday(id);
      setHolidays(holidays.filter(h => h.id !== id));
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
      // 🔹 Sin alerta, solo log
    }
  };

  if (!show) return null; // no renderizar nada si no se muestra

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? "Editar Solicitud" : "Nueva Solicitud"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Lista de solicitudes */}
            {holidays.length > 0 && (
              <ul className="list-group mb-3">
                {holidays.map(h => (
                  <li
                    key={h.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>Desde:</strong> {h.fechaInicio} |{" "}
                      <strong>Hasta:</strong> {h.fechaFin} |{" "}
                      <strong>Tipo:</strong> {h.tipo}
                    </span>
                    <span>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(h)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(h.id)}
                      >
                        Eliminar
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Formulario */}
            <div className="mb-3">
              <label className="form-label">Desde</label>
              <input
                type="date"
                name="fechaInicio"
                className="form-control"
                value={formData.fechaInicio}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hasta</label>
              <input
                type="date"
                name="fechaFin"
                className="form-control"
                value={formData.fechaFin}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Horas (opcional)</label>
              <input
                type="time"
                name="horas"
                className="form-control"
                value={formData.horas}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de solicitud</label>
              <select
                name="tipo"
                className="form-select"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                <option value="vacaciones">Vacaciones</option>
                <option value="incidencias">Incidencias</option>
                <option value="permiso_retribuido">Permiso Retribuido</option>
                <option value="permiso_no_retribuido">Permiso No Retribuido</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Escribe detalles de la solicitud..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : editingId
                ? "Guardar cambios"
                : "Enviar solicitud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

