import React from "react";
import LogoClockIN from "../assets/img/LogoClockIn.png";


export const Login = () => {
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
                                <img src={LogoClockIN} alt="ClockIn Logo" style={{ width: "200px", marginRight: "100px" }}/>
                            </div>
                            <h4 className="text-center mb-4">Iniciar Sesión</h4>

                            <form>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control rounded-3"
                                        placeholder="Correo"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        placeholder="Contraseña"
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

                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};