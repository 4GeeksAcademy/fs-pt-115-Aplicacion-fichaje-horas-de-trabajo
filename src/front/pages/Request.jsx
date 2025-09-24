import { ButtonRequest } from "../components/ButtonRequest";
import { UserRequest } from "../components/UserRequest";


export const Request = () => {
  const handleAccept = (id) => {
    console.log(`Solicitud ${id} aceptada ✅`);
  };

  const handleReject = (id) => {
    console.log(`Solicitud ${id} rechazada ❌`);
  };

  const handleMessage = (id, mensaje) => {
    console.log(`Mensaje para solicitud ${id}: ${mensaje}`);
  };

  return (
    <div className="container-fluid">
      {/* Botón para abrir sidebar */}
      <button
        className="btn btn-primary my-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
      >
        Index
      </button>

      {/* Sidebar */}
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
              <a className="nav-link" href="#pending">
                Pending Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#accept">
                Accepted Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#denied">
                Denied Requests
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

        {/* Pending */}
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="pending">Pending Requests</h5>
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id}>
              <UserRequest  />
              <ButtonRequest
                modalId={`modal-pending-${id}`}
                onAccept={() => handleAccept(id)}
                onReject={() => handleReject(id)}
                onMessage={(msg) => handleMessage(id, msg)}
              />
            </div>
          ))}
        </div>

        <hr className="text-light" />

        {/* Accepted */}
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="accept">Accepted Requests</h5>
          <UserRequest />
        </div>

        <hr className="text-light" />

        {/* Denied */}
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="denied">Denied Requests</h5>
          <UserRequest />
        </div>

        <hr className="text-light" />

        {/* Canceled */}
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="canceled">Canceled Requests</h5>
          <UserRequest />
        </div>

        <hr className="text-light" />

        {/* Completed */}
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="completed">Completed Requests</h5>
          <UserRequest />
        </div>
      </div>
    </div>
  );
};
