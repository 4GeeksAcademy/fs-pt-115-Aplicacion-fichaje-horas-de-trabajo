import { useId } from "react";

export function UserRequest({ user }) {
 
  const autoId = useId().replace(/:/g, "");
  const modalId = `userCardModal-${autoId}`;

  const {
    user: userInfo = {},
    fechaInicio = "—",
    fechaFin = "—",
    descripcion = "—",
    tipo = "—",
    status = "—",
  } = user || {};

  const { email = "—" } = userInfo;
   return (
    <>
      <button
        type="button"
        className="btn btn-outline-info w-100 my-2 text-start"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
        aria-controls={modalId}
      >
        👤 {email}
      </button>

      <div
        className="modal fade"
        id={modalId}
        tabIndex={-1}
        aria-labelledby={`${modalId}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}-label`}>
                Datos de la Solicitud
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Email:</strong> {email}</li>
                <li className="list-group-item"><strong>Tipo:</strong> {tipo}</li>
                <li className="list-group-item"><strong>Estado:</strong> {status}</li>
                <li className="list-group-item"><strong>Desde:</strong> {fechaInicio}</li>
                <li className="list-group-item"><strong>Hasta:</strong> {fechaFin}</li>
                <li className="list-group-item"><strong>Comentario:</strong> {descripcion}</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}