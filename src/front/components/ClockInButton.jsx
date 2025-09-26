import { useState } from "react";
import { addsigning, getLocation, getSignType, toggleStatus, getSignings } from "../services/APIServices";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ClockInButton = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onButtonClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const locationData = await getLocation();
      const lat = locationData["latitude"];
      const long = locationData["longitude"];

      const lastSigningData = await getSignType(store.user.id);
      console.log("lastsigningdata:", lastSigningData)

      const signingData = {
        user_id: store.user.id,
        sign_type_id: lastSigningData?.id,
        sign_type_name: lastSigningData?.name,
        datetime: new Date().toISOString(),
        lat,
        long,
      };

      const created = await addsigning(store.user.id, signingData);
      const updatedSignings = await getSignings(store.user.id, token);
      dispatch({ type: "GET_SIGNINGS", payload: updatedSignings });
      console.log("Fichaje Creado:", created)

      await toggleStatus(store.user.id);

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
        className="btn btn-success rounded-circle m-2"
        style={{ width: "120px", height: "120px" }}
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading ? "Loading..." : "Clock In"}
      </button>

      {message && (
        <div className="mt-2 text-center">
          <span>{message}</span>
        </div>
      )}
    </>
  );
};