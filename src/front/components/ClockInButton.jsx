import { useState } from "react";
import { addsigning, getLocation, getSignType, toggleStatus, getSignings } from "../services/APIServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";

export const ClockInButton = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { id: paramId } = useParams();

  // Si hay id en la URL, se usa ese, si no, se usa el del store
  const targetUserId = paramId ? Number(paramId) : store.user.id;

  const onButtonClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const locationData = await getLocation();
      const lat = locationData["latitude"];
      const long = locationData["longitude"];

      // Se consulta el último signing del usuario correcto
      const lastSigningData = await getSignType(targetUserId);

      console.log("lastSigningData:", lastSigningData);

      const signingData = {
        user_id: targetUserId,
        sign_type_id: lastSigningData?.id,
        sign_type_name: lastSigningData?.name,
        datetime: new Date().toISOString(),
        lat,
        long,
      };

      const created = await addsigning(targetUserId, signingData);
      const updatedSignings = await getSignings(targetUserId, token);
      dispatch({ type: "GET_SIGNINGS", payload: updatedSignings });

      console.log("Fichaje Creado:", created);

      await toggleStatus(targetUserId);

      setMessage("Fichaje realizado con éxito");
    } catch (err) {
      console.error("Error creando fichaje:", err);
      setMessage("Hubo un error al realizar el fichaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn w-100 text-white"
        style={{ backgroundColor: "#ff7b00" }}
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading ? "Loading..." : "Clock In"}
      </button>

      {message && (
        <div className="mt-2 text-center text-light d-flex flex-column">
          <span>{message}</span>
        </div>
      )}
    </>
  );
};