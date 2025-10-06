import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { getUserByToken } from "../services/APIServices";
import { useEffect, useState } from "react";
import { RegisterMemberModal } from "./RegisterMemberModal";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const { store, dispatch } = useGlobalReducer();
  const userId = store.user?.id;


  useEffect(() => {
    const fetchUser = async () => {
      const token = await localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const userData = await getUserByToken(token);
        setUser(userData);
        dispatch({ type: "SET_USER", payload: userData });
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = () => {;
    setUser(null);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white">
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
        <div className="collapse navbar-collapse justify-content-end text-end" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            {user?.is_admin && (
              <>
                <li className="nav-item">
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                    className="btn btn-success m-2"
                  >
                    Add worker
                  </button>{" "}
                </li>
                <RegisterMemberModal />
                <li className="nav-item">
                  <Link to="/admin/request">
                    <button className="btn btn-primary m-2">
                      Requests
                      <span className="badge text-bg-secondary"></span>
                    </button>
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <Link to={`/profile/${userId}`}>
                    <button className="btn btn-dark m-2">My Profile</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={onSubmit} className="btn btn-danger m-2">
                    Log out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
