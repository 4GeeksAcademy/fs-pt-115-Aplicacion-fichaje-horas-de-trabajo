import React, { useState, useEffect } from "react";
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from "../services/APIServices";

export default function SolicitudVacaciones() {
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    horas: "",
    tipo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const data = await getHolidays();
        setHolidays(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Error al cargar las solicitudes");
      }
    };
    fetchHolidays();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
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
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al enviar la solicitud");
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
      console.error(err);
      setErrorMsg("Error al eliminar la solicitud");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Gestión de Solicitudes</h3>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Lista de solicitudes */}
      <ul className="list-group mb-3">
        {holidays.map(h => (
          <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>Desde:</strong> {h.fechaInicio} | <strong>Hasta:</strong> {h.fechaFin} | <strong>Tipo:</strong> {h.tipo}
            </span>
            <span>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(h)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(h.id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>

      {/* Formulario */}
      <div className="card p-3">
        <h5>{editingId ? "Editar Solicitud" : "Nueva Solicitud"}</h5>

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

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Procesando..." : editingId ? "Guardar cambios" : "Enviar solicitud"}
        </button>
      </div>
    </div>
  );
}

