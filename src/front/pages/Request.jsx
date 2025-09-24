import { useEffect, useState } from "react";
import  {BotonSolicitud}  from "../components/BotonSolicitud";
import { UserRequest } from "../components/UserRequest";

export const Request = () => {
  const [requests, setRequests] = useState({
    pending: [1, 2, 3],
    accepted: [],
    rejected: [],
    canceled: [],
    completed: [],
  });

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests"); 
        if (!res.ok) throw new Error("Error al obtener solicitudes");

        const data = await res.json();

        setRequests({
          pending: data.filter((r) => r.status === "pending"),
          accepted: data.filter((r) => r.status === "accepted"),
          rejected: data.filter((r) => r.status === "rejected"),
          canceled: data.filter((r) => r.status === "canceled"),
          completed: data.filter((r) => r.status === "completed"),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  // Actualizar estado de una solicitud en la API + mover en la UI
  const updateRequestStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH", // PATCH para actualizar parcialmente
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error al actualizar solicitud");

      setRequests((prev) => {
        const updated = { ...prev };
        let request;

        // Sacar la solicitud de la lista donde esté
        for (const key of Object.keys(updated)) {
          const index = updated[key].findIndex((r) => r.id == id); // == para cubrir string/number
          if (index !== -1) {
            request = updated[key][index];
            updated[key].splice(index, 1);
            break;
          }
        }

        // Meterla en la nueva lista
        if (request) {
          request.status = newStatus;
          updated[newStatus] = updated[newStatus]
            ? [...updated[newStatus], request]
            : [request];
        }

        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = (id) => updateRequestStatus(id, "accepted");
  const handleReject = (id) => updateRequestStatus(id, "rejected");

  const handleMessage = async (id, mensaje) => {
    try {
      const res = await fetch(`/api/requests/${id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");

      console.log(`Mensaje enviado para solicitud ${id}: ${mensaje}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Función auxiliar para renderizar una sección
  const renderSection = (title, idSection, list) => (
    <div
      className="p-2 overflow-y-auto mb-4"
      style={{ width: "50%", height: "200px" }}
    >
      <h5 id={idSection}>{title}</h5>
      {list.length === 0 ? (
        <p className="text-muted">No hay solicitudes</p>
      ) : (
        list.map((req) => (
          <div key={req.id} className="mb-2">
            <UserRequest user={req} />
            {(req.status === "pending" || req.status === "rejected") && (
              <BotonSolicitud 
                modalId={`modal-${idSection}-${req.id}`}
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
              <a className="nav-link" href="#accepted">
                Accepted Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#rejected">
                Rejected Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#canceled">
                Canceled Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#completed">
                Completed Requests
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido */}
      <div className="container d-flex flex-column align-items-center">
        <h1 className="m-2">Request Page</h1>
        <hr className="text-light" />

        {renderSection("Pending Requests", "pending", requests.pending)}
        <BotonSolicitud />
        {renderSection("Accepted Requests", "accepted", requests.accepted)}
        {renderSection("Rejected Requests", "rejected", requests.rejected)}
        {renderSection("Canceled Requests", "canceled", requests.canceled)}
        {renderSection("Completed Requests", "completed", requests.completed)}
      </div>
    </div>
  );
};
