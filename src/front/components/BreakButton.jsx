import { useState } from "react";
import { addsigning, getLocation, getSignType, toggleStatus } from "../services/APIServices";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const BreakButton = () => {
  const { store } = useGlobalReducer();
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

      const signingData = {
        user_id: store.user.id,
        sign_type_id: lastSigningData?.id,
        datetime: new Date().toISOString(),
        lat,
        long,
      };

      const created = await addsigning(store.user.id, signingData);
      console.log("Fichaje Creado:", created);

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