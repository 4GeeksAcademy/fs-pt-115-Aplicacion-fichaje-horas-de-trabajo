import { useId } from "react";

export function UserRequest({ user }) {
  const autoId = useId();
  const modalId = `userCardModal-${autoId}`;

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-info w-100 my-2 text-start"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        👤 {user?.name || "Usuario sin nombre"}
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
              <p><strong>Nombre:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Estado:</strong> {user?.status}</p>
              <p><strong>Fecha:</strong> {user?.date}</p>
              <p><strong>Comentario:</strong> {user?.comment}</p>
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
