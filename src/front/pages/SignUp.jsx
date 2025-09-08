import React, { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { crearUsuario } from "../services/APIServices.js";

export const SignUp = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    surname: "",
    lastName: "",
    birthDate: "",
    address: "",
    rol: "",
    email: "",
    password: "",
    dni_nie: "",
    iban: "",
  });

  const handleInputsChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      newUser.firstName === "" &&
      newUser.surname === "" &&
      newUser.email === "" &&
      newUser.password === "" &&
      newUser.rol === "" &&
      newUser.dni_nie === "" &&
      newUser.iban === "" &&
      newUser.address === "" &&
      newUser.lastName === "" &&
      newUser.birthDate === ""
    ) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    crearUsuario(newUser);
  };

  return (
    <>
      <div>
        <div className="container">
          <div className="row justify-content-center align-content-top min-vh-100 mt-5 bg">
            <div className="col-md-8 col-lg-6 col-sm-10">
              <form className="card p-4 shadow rounded-4 bg-dark text-white">
                <div className="d-flex align-items-center justify-content-center mb-3"></div>
                <h2 className="text-center mb-3">Sign In</h2>
                {/* <div className="text-center ">
                     <img
                      src="https://i.pinimg.com/originals/44/48/2b/44482b0788436b607f176b6ac2c128f3.png"
                      className="img-fluid mb-3"
                      style={{ height: "150px" }}
                      alt="..."
                    /> 
                  </div> */}

                <div className="text-center d-flex flex-column mb-3">
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Name
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.firstName}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Surname
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.surname}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Last Name
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.lastName}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  {/* Fecha de nacimiento*/}
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="date"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.birthDate}
                      id="fecha"
                      name="fecha"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Address
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.address}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Rol
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.rol}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Email
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.email}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Password
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.password}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      DNI/NIE
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.dni_nie}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="input-group input-group-sm mb-3">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      IBAN
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputsChange}
                      value={newUser.iban}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  onSubmit={handleSubmit}
                  className="btn btn-primary w-100 mt-3"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
