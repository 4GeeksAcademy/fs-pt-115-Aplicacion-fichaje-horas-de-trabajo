import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { actualizarUsuario, getUsuarios } from "../services/APIServices.js"


export const EditUserModal = () => {
  const { store, dispatch } = useGlobalReducer();
  const user = store.user;

  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    last_name: "",
    birth_date: "",
    address: "",
    rol: "",
    email: "",
    password: "",
    DNI: "",
    iban: "",
    is_admin: false,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("danger");

  useEffect(() => {
    if (user) {

      let formattedDate = "";
      if (user.birth_date) {
        const d = new Date(user.birth_date);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split("T")[0];
        }
      }

      setFormData({
        first_name: user.first_name || "",
        surname: user.surname || "",
        last_name: user.last_name || "",
        birth_date: formattedDate,
        address: user.address || "",
        rol: user.rol || "",
        email: user.email || "",
        password: "",
        DNI: user.DNI || "",
        iban: user.iban || "",
        is_admin: user.is_admin || false,
      });
    }
  }, [user]);

  const handleInputsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const updatedUser = await actualizarUsuario(user.id, payload);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      getUsuarios(dispatch);

      setFormData({
        ...formData,
        ...updatedUser,
        // No sobrescribir password si está vacío
        password: formData.password
      });

      const modalEl = document.getElementById("editUserModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      setAlertType("success");
      setAlertMsg("Usuario actualizado correctamente");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setAlertType("danger");
      setAlertMsg(err.message || "Error actualizando usuario");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  return (
    <div
      className="modal fade"
      id="editUserModal"
      tabIndex="-1"
      aria-labelledby="editUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content shadow rounded-4 bg-dark text-white">
          <div className="modal-header">
            <h2 className="modal-title">Editar Perfil</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {showAlert && (
              <div className={`alert alert-${alertType} text-center`}>
                {alertMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Nombre</span>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Apellido 1</span>
                <input
                  type="text"
                  className="form-control"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Apellido 2</span>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Fecha de Nacimiento</span>
                <input
                  type="date"
                  className="form-control"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Dirección</span>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Rol</span>
                <input
                  type="text"
                  className="form-control"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Email</span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Contraseña (nueva)</span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">DNI/NIE</span>
                <input
                  type="text"
                  className="form-control"
                  name="DNI"
                  value={formData.DNI}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">IBAN</span>
                <input
                  type="text"
                  className="form-control"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputsChange}
                />
              </div>

              {store.user.isadmin && (<div className="form-check ms-3 mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleInputsChange}
                />
                <label className="form-check-label">Es admin</label>
              </div>)}

              <button type="submit" className="btn btn-primary w-100">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};