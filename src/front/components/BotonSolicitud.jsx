import { useState } from "react";

export const BotonSolicitud = ({ onAccept, onReject, onMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onMessage(message);
      setMessage(""); 
    }
  };

  return (
    <div className="d-flex flex-column my-2">
      <div className="d-flex gap-2">
        <button
          className="btn btn-success btn-sm"
          onClick={onAccept}
        >
          ✅ Aceptar
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={onReject}
        >
          ❌ Rechazar
        </button>
      </div>

      <div className="input-group mt-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSend}
        >
          💬 Enviar
        </button>
      </div>
    </div>
  );
};
