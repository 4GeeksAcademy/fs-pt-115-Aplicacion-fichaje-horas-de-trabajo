import { useState } from "react";
import { addsigning, getLocation, getSignType, toggleStatus, getSignings, getUserByToken} from "../services/APIServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";

export const ClockInButton = ({ onClockIn}) => {
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
      const locationData = await getLocation();
      const lat = locationData["latitude"];
      const long = locationData["longitude"];

      // Último tipo de signing
      const lastSigningData = await getSignType(targetUserId);

      const signingData = {
        user_id: targetUserId,
        sign_type_id: lastSigningData?.id,
        sign_type_name: lastSigningData?.name,
        datetime: new Date().toISOString(),
        lat,
        long,
      };

      const created = await addsigning(targetUserId, signingData);
      console.log("Fichaje Creado:", created);

      const updatedSignings = await getSignings(targetUserId, dispatch);
      console.log("Fichajes obtenidos:", updatedSignings);

      const user= await getUserByToken()

      await toggleStatus(targetUserId);

      setMessage("Fichaje realizado con éxito");

      if (onClockIn) {
        onClockIn();
      }
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
        className="btn w-100 text-2C2C2C "
        style={{ backgroundColor: "#FF7B00" }}
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading ? "Loading..." : <strong>Clock In</strong>}
      </button>

      {message && (
        <div className="mt-2 text-center text-light d-flex flex-column">
          <span>{message}</span>
        </div>
      )}
    </>
  );
};