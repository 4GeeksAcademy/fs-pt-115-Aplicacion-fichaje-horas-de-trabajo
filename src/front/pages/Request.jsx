import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ButtonRequest } from "../components/ButtonRequest";
import { UserRequest } from "../components/UserRequest";
import { getHolidays, updateHoliday } from "../services/APIServices";

export const Request = () => {
  const { store, dispatch } = useGlobalReducer();

  // Cargar solicitudes al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHolidays();
        dispatch({ type: "GET_HOLIDAYS", payload: data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [dispatch]);

  // Actualización del estado
  const handleUpdate = async (id, status) => {
    // Actualización optimista
    dispatch({ type: "UPDATE_HOLIDAY", payload: { id, status } });

    try {
      await updateHoliday(id, { status });
    } catch (err) {
      console.error(err);
    }
  };

  // Enviar mensaje del admin
  const handleMessage = async (id, message) => {
    try {
      await updateHoliday(id, { adminMessage: message });
      dispatch({ type: "UPDATE_HOLIDAY", payload: { id, adminMessage: message } });
    } catch (err) {
      console.error(err);
    }
  };

  const renderSection = (title, status) => {
    const list = store.holidays.filter((h) => h.status === status);

    return (
      <div
        className="p-2 mb-5 border border border rounded bg-dark"
        style={{ width: "50%", height: "200px", overflowY: "auto" }}
      >
        <h5>{title}</h5>
        {list.length === 0 ? (
          <p className="text-white">There are no requests</p>
        ) : (
          list.map((req) => (
            <div key={req.id} className="mb-2">
              <UserRequest user={req} />
              {/* Botones solo si la solicitud está pendiente */}
              {req.status === "pendiente" && (
                <ButtonRequest
                  modalId={`modal-${status}-${req.id}`}
                  onAccept={() => handleUpdate(req.id, "aprobado")}
                  onReject={() => handleUpdate(req.id, "rechazado")}
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
    <div className="container mt-5 d-flex flex-column align-items-center text-white border border border rounded bg-dark">
      <h1 className="my-4 p-5 ">Vacation Requests</h1>
      {renderSection("Pending", "pendiente")}
      {renderSection("Accepted", "aprobado")}
      {renderSection("Rejected", "rechazado")}
    </div>
  );
};
