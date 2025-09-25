import React, { useState, useEffect } from "react";
import { ButtonRequest } from "../components/ButtonRequest";
import { UserRequest } from "../components/UserRequest";

export const Request = () => {
  const [requests, setRequests] = useState([]);

  
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/requests/${id}/${status}`, {
        method: "POST",
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: status === "accept" ? "accepted" : "denied" } : req
          )
        );
      }
    } catch (error) {
      console.error(`Error al actualizar solicitud ${id}:`, error);
    }
  };

  const sendMessage = async (id, message) => {
    try {
      const res = await fetch(`/api/requests/${id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        console.log(`Mensaje enviado a solicitud ${id}: ${message}`);
      }
    } catch (error) {
      console.error(`Error enviando mensaje a solicitud ${id}:`, error);
    }
  };

  const handleAccept = (id) => updateRequestStatus(id, "accept");
  const handleReject = (id) => updateRequestStatus(id, "reject");
  const handleMessage = (id, message) => sendMessage(id, message);

  const renderSection = (title, status) => {
    const list = requests.filter((r) => r.status === status);

    return (
      <div
        className="p-2 overflow-y-auto"
        style={{ width: "50%", height: "200px" }}
      >
        <h5 id={status}>{title}</h5>
        {list.length === 0 ? (
          <p className="text-muted">No hay solicitudes</p>
        ) : (
          list.map((req) => (
            <div key={req.id} className="mb-2">
              <UserRequest user={req} />
              {status === "pending" && (
                <ButtonRequest
                  modalId={`modal-${status}-${req.id}`}
                  onAccept={() => handleAccept(req.id)}
                  onReject={() => handleReject(req.id)}
                  onMessage={(msg) => handleMessage(req.id, msg)}
                />
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Sidebar */}
      <button
        className="btn btn-primary my-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
      >
        Index
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 id="sidebarMenuLabel">Sections</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href="#pending">Pending Requests</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#accepted">Accepted Requests</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#denied">Denied Requests</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido */}
      <div className="container d-flex flex-column align-items-center">
        <h1 className="m-2">Request Page</h1>
        <hr className="text-light" />
        {renderSection("Pending Requests", "pending")}
        <hr />
        {renderSection("Accepted Requests", "accepted")}
        <hr />
        {renderSection("Denied Requests", "denied")}
      </div>
    </div>
  );
};
