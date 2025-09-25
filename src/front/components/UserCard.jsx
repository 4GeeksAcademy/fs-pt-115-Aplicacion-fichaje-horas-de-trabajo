import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { deleteSigning, updateSigning } from "../services/APIServices";
import { useParams } from "react-router-dom";

export const UserCard = ({ sign_id, latitude, longitude, date, type }) => {
  const { store, dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();

  // Función para formatear fecha para mostrar en la tarjeta
  const formatDateForCard = (dateString) => {
    if (!dateString) return "Sin fecha";
    const d = new Date(dateString);
    return d.toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para formatear fecha para el input datetime-local
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    lat: latitude,
    long: longitude,
    datetime: formatDateForInput(date),
    sign_type_id: type,
  });

  const handleDelete = async () => {
    await deleteSigning(sign_id, id);
    dispatch({
      type: "DELETE_SIGNING",
      payload: sign_id,
    });
  };

  const handleEdit = () => {
    setFormData({
      lat: latitude,
      long: longitude,
      datetime: formatDateForInput(date),
      sign_type_id: type,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const updated = await updateSigning(id, sign_id, formData);

    dispatch({
      type: "EDIT_SIGNING",
      payload: updated,
    });
    setShowModal(false);
  };

  return (
    <>
      {/* Tarjeta */}
      <li
        className="list-group-item col-12 border rounded shadow-sm bg-light mb-3 p-3 text-dark"
        key={sign_id}
      >
        <div className="row align-items-center">
          {/* Columna de avatar */}
          <div className="col-md-2 text-center">
            <img
              src={rigoImageUrl}
              className="rounded-circle mb-2"
              style={{ width: "70px", height: "70px", objectFit: "cover" }}
              alt="User"
            />
            <h6 className="mb-0">{store?.user?.first_name ?? "Usuario"}</h6>
            <small className="text-muted">{store?.user?.rol ?? "Rol"}</small>
          </div>

          {/* Columna de datos */}
          <div className="col-md-8">
            <div className="row mb-2">
              <div className="col-sm-6">
                <strong>Latitude:</strong>
                <p className="mb-0">{latitude}</p>
              </div>
              <div className="col-sm-6">
                <strong>Longitude:</strong>
                <p className="mb-0">{longitude}</p>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-6">
                <strong>Datetime:</strong>
                <p className="mb-0">{formatDateForCard(date)}</p>
              </div>
              <div className="col-sm-6">
                <strong>Type:</strong>
                <p className="mb-0">{type}</p>
              </div>
            </div>
          </div>

          {/* Columna de acciones */}
          <div className="col-md-2 d-flex flex-column align-items-end gap-2">
            <button
              type="button"
              className="btn btn-danger btn-sm w-100"
              onClick={handleDelete}
            >
              <i className="fa-solid fa-trash me-1"></i> Eliminar
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm w-100"
              onClick={handleEdit}
            >
              <i className="fa-solid fa-pencil me-1"></i> Editar
            </button>
          </div>
        </div>
      </li>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Editar Signing</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.lat}
                    onChange={(e) =>
                      setFormData({ ...formData, lat: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.long}
                    onChange={(e) =>
                      setFormData({ ...formData, long: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Datetime</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.datetime}
                    onChange={(e) =>
                      setFormData({ ...formData, datetime: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.sign_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sign_type_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};