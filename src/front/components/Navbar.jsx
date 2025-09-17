import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { getUserByToken } from "../services/APIServices";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
  const fetchUser = async () => {
    const token = await localStorage.getItem("token");
    if (!token) {
      console.log("No hay token, usuario no logueado");
      return;
    }

    try {
      const userData = await getUserByToken(token);
      console.log("Usuario obtenido:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
    }
  };
   fetchUser();
  }, []);

  const onSubmit = () => {
    console.log(user?.is_admin)
    setUser(null)
    localStorage.clear()
    window.location.href = '/login';
    window
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        {/* <Link
          to={localStorage.getItem("token") ? "/home" : "/login"}
          className="navbar-brand text-light"
        >
          Clock In
        </Link> */}
        <Link to="/" className="navbar-brand text-light">
          Clock In
        </Link>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user?.is_admin && (
              <>
                <li className="nav-item">
                  <Link to="/admin/signup">
                    <button className="btn btn-success m-2">Add worker</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/request">
                    <button className="btn btn-primary m-2">
                      Requests{" "}
                      <span className="badge text-bg-secondary">4</span>
                    </button>
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link to="/profile">
                <button className="btn btn-dark m-2">My Profile</button>
              </Link>
            </li>
            {user && (
            <li className="nav-item">
                <button onClick={onSubmit} className="btn btn-danger m-2">Log out</button>
            </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
// <hr className="text-light" />
// <div className="row text-center mb-4">
//   <h2 className="text-light">Request Pending</h2>
//   <Link to="/admin/request">
//   <button
//     type="button"
//     class="btn btn-success w-100 p-2">
//     Ir a Request
//   </button>
//   </Link>
// </div>
// <hr className="text-light" />
