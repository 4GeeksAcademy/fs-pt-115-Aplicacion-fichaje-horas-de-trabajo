import React, { useState } from "react";

export function ButtonRequest({ modalId, onAccept, onReject, onMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onMessage(message);
      setMessage("");
    }
  };

  return (
    <>
      {/* Botones Aceptar / Rechazar / Mensaje */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={onAccept}
        >
          ✅ Aceptar
        </button>
        <button
          className="btn btn-danger"
          onClick={onReject}
        >
          ❌ Rechazar
        </button>
        <button
          className="btn btn-info"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
        >
          💬 Mensaje
        </button>
      </div>

      {/* Modal para enviar mensaje */}
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}-label`}>
                Enviar Mensaje
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSend}
                              data-bs-dismiss="modal"
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }
