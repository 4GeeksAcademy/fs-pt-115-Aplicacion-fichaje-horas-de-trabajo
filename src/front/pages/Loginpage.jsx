import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import LogoClockIN from "../assets/img/LogoClockIn.png";
import { useNavigate } from "react-router-dom";
import { login } from "../services/APIServices.js";

export const Loginpage = () => {
  const { store, dispatch } = useGlobalReducer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Botón de login clicado");
    setError("");

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      dispatch({ type: "SET_USER", payload: data.user });
      navigate("/");
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ff7b00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", 
      }}
    >
      <div className="container">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-md-5">
            <div className="card p-4 shadow rounded-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <img
                  src={LogoClockIN}
                  alt="ClockIn Logo"
                  style={{ maxWidth: "150px"}}
                />
              </div>
              <h4 className="text-center mb-4">Iniciar Sesión</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control rounded-3"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control rounded-3"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 rounded-3 fw-bold"
                  style={{ backgroundColor: "#246BFD", border: "none" }}
                >
                  Entrar
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
