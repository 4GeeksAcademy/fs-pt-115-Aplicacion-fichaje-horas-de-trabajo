import React, { useState } from "react";
import { crearSolicitud } from "../services/APIServices";

export default function SolicitudVacaciones() {
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    horas: "",
    tipo: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await crearSolicitud(formData);
      console.log("Solicitud enviada con éxito:", data);
      alert(" Solicitud creada con éxito");
    } catch (error) {
      setErrorMsg(" Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="solicitudModal"
      tabIndex="-1"
      aria-labelledby="solicitudModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="solicitudModalLabel">
              Nueva Solicitud
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <form>
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
                  <option value="permiso_no_retribuido">
                    Permiso No Retribuido
                  </option>
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
                ></textarea>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              data-bs-dismiss={!loading ? "modal" : ""}
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
