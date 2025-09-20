import React from "react";
import { UserCard } from "../components/UserCard";
import { News } from "../components/News";
import { Link } from "react-router-dom";
import { useAuthGuard } from "../components/AuthToken";

export default function FechaActual() {
  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <p>{fecha}</p>;
}

export const AdminDashboard = () => {
  return (
    <div className="container-md">
      <div className="row p-3">
        <div className="col-md-4">
          <div className="text-bg-warning p-2 text-center rounded-4">
            <h1>Hello Admin, Welcome</h1>
            {FechaActual()}
            <Link to="/admin/perfilnew">
              <button type="button" class="btn btn-success btn-lg">
                Add new employee
              </button>
            </Link>
          </div>
          <div className="mt-5">
            <h3 className="text-center ">Who's In</h3>
            <h6 className="fw-bold">Working</h6>
            <UserCard />
            <h6 className="fw-bold">Work Remotely</h6>
            <UserCard />
            <h6>Break</h6>
            <UserCard />
            <h6 className="fw-bold">In Hollidays</h6>
            <UserCard />
          </div>
        </div>
        <div className="col-md-4">
          <h3 className="text-center">Documents</h3>
          <div className="mb-3">
            <label for="formFile" className="form-label">
              Subir documentación
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <div className="d-flex gap-2 pt-1">
              <button type="button" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <h3 className="text-center">Requests</h3>
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle w-100"
              type="button"
              id="requestsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              📩 Requests recibidos
            </button>
            <ul class="dropdown-menu w-100" aria-labelledby="requestsDropdown">
              <li>
                <a class="dropdown-item" href="#">
                  Request #1 - Nuevo documento
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Request #2 - Actualización de datos
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Request #3 - Revisión pendiente
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item text-danger" href="#">
                  Ver todos los requests
                </a>
              </li>
            </ul>
          </div>

          <h3 className="text-center mt-5 pt-5">News!</h3>
          <News />
        </div>
      </div>
    </div>
  );
};
