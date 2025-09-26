import { useState } from "react";
import { addsigning, getLocation, getSignType, toggleStatus } from "../services/APIServices";
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
      dispatch({type: "GET_SIGNINGS", payload: [...store.signings, created]})
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