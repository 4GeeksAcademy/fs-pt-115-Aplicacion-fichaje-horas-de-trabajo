import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { crearUsuario, getUsuarios } from "../services/APIServices.js";

export const RegisterMemberModal = () => {
  const { dispatch } = useGlobalReducer();

  const [newUser, setNewUser] = useState({
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
    status: "Unavailable",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleInputsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    const requiredFields = [
      "first_name",
      "surname",
      "last_name",
      "birth_date",
      "address",
      "rol",
      "email",
      "password",
      "DNI",
      "iban",
    ];
    const missing = requiredFields.filter((f) => !newUser[f]);
    if (missing.length > 0) {
      setAlertMsg(`Faltan campos: ${missing.join(", ")}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      await crearUsuario(newUser);

      // Refresca la lista de usuarios sin tocar el token
      getUsuarios(dispatch);

      // Cerrar modal
      const modalEl = document.getElementById("registerModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      // Mensaje de éxito
      setAlertMsg("User created successfully");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      // Limpiar formulario
      setNewUser({
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
    } catch (err) {
      console.error("Error creando usuario:", err);
      setAlertMsg(err.message || "Error creating user");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  return (
    <div
      className="modal fade"
      id="registerModal"
      tabIndex="-1"
      aria-labelledby="registerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content shadow rounded-4 bg-dark text-white">
          <div className="modal-header">
            <h2 className="modal-title">Register User</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {showAlert && (
              <div className="alert alert-danger text-center">{alertMsg}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Name</span>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Last Name</span>
                <input
                  type="text"
                  className="form-control"
                  name="surname"
                  value={newUser.surname}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Second Last Name</span>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Birth Date</span>
                <input
                  type="date"
                  className="form-control"
                  name="birth_date"
                  value={newUser.birth_date}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Address</span>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={newUser.address}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Rol</span>
                <input
                  type="text"
                  className="form-control"
                  name="rol"
                  value={newUser.rol}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Email</span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Password</span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">DNI/NIE</span>
                <input
                  type="text"
                  className="form-control"
                  name="DNI"
                  value={newUser.DNI}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">IBAN</span>
                <input
                  type="text"
                  className="form-control"
                  name="iban"
                  value={newUser.iban}
                  onChange={handleInputsChange}
                />
              </div>

              <div className="form-check ms-3 mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_admin"
                  checked={newUser.is_admin}
                  onChange={handleInputsChange}
                />
                <label className="form-check-label">Is Admin</label>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};