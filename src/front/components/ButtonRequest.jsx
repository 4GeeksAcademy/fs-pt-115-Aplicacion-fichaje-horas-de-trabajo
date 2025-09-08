export const ButtonRequest = () => {
  return (
    <div className="d-flex gap-2 mb-5">
        <button type="button" className="btn btn-success">
          ✅ Aceptar
        </button>
        <button type="button" className="btn btn-danger">
          ❌ Rechazar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#mensajeModal"
        >
          💬 Comment
        </button>
        <div
          className="modal fade"
          id="mensajeModal"
          tabindex="-1"
          aria-labelledby="mensajeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="mensajeModalLabel">
                  Mensaje
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                <form id="formMensaje">
                  <div className="mb-3">
                    <label for="mensaje" className="form-label">
                      Escribe tu mensaje:
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="formMensaje"
                  className="btn btn-primary"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}