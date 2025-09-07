import React from "react";
import LogoClockIN from "../assets/img/LogoClockIn.png";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token); // guardar token
      navigate("/dashboard");
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
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card p-4 shadow rounded-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <img
                  src={LogoClockIN}
                  alt="ClockIn Logo"
                  style={{ width: "200px", marginRight: "100px" }}
                />
              </div>
              <h4 className="text-center mb-4">Iniciar Sesión</h4>

<<<<<<< Updated upstream
                            <p className="text-center mt-3">
                                ¿No tienes cuenta?{" "}
                                <a href="#" style={{ color: "#ff7b00", fontWeight: "bold" }}>
                                    Regístrate
                                </a>
                            </p>
                        </div>
                    </div>
=======
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
>>>>>>> Stashed changes
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
