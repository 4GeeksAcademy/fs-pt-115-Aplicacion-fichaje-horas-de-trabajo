import React, { useState, useEffect } from "react";

export function ButtonRequest({ modalId, onAccept, onReject, onMessage = () => {} }) {
  const [message, setMessage] = useState("");

  // Limpiar mensaje cada vez que se abra el modal
  useEffect(() => {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    const handleShow = () => setMessage("");
    modalEl.addEventListener("show.bs.modal", handleShow);

    return () => modalEl.removeEventListener("show.bs.modal", handleShow);
  }, [modalId]);

  const handleSend = () => {
    if (message.trim()) {
      onMessage(message);
      setMessage("");
    }
  };

  return (
    <>
      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={onAccept}>✅ Accept</button>
        <button className="btn btn-danger" onClick={onReject}>❌ Reject</button>
        <button className="btn btn-info" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>💬 Message</button>
      </div>

      <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}-label`} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}-label`}>Send Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-primary" onClick={handleSend} data-bs-dismiss="modal">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}