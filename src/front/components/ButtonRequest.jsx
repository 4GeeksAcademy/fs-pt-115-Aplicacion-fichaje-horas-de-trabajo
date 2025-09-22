import { useId } from "react";

export const ButtonRequest = ({ onAccept, onReject, onMessage, modalId }) => {
  // Si no llega un modalId lo generamos automáticamente
  const autoId = useId();
  const uniqueModalId = modalId || `mensajeModal-${autoId}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const mensaje = e.target.elements.mensaje.value;
    if (onMessage) {
      onMessage(mensaje);
    }
    // cerrar el modal al enviar
    const modalEl = document.getElementById(uniqueModalId);
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
    e.target.reset();
  };

  return (
    <div className="d-flex gap-2 mb-5">
      {/* Botones de acción */}
      <button type="button" className="btn btn-success" onClick={onAccept}>
        ✅ Aceptar
      </button>
      <button type="button" className="btn btn-danger" onClick={onReject}>
        ❌ Rechazar
      </button>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#${uniqueModalId}`}
      >
        💬 Comment
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id={uniqueModalId}
        tabIndex="-1"
        aria-labelledby={`${uniqueModalId}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${uniqueModalId}-label`}>
                Mensaje
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <form id={`form-${uniqueModalId}`} onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor={`mensaje-${uniqueModalId}`} className="form-label">
                    Escribe tu mensaje:
                  </label>
                  <textarea
                    className="form-control"
                    id={`mensaje-${uniqueModalId}`}
                    name="mensaje"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
