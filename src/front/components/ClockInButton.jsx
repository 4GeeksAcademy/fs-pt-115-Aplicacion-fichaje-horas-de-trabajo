import { useEffect } from "react";
import { addsigning } from "../services/APIServices";
import useGlobalReducer from "../hooks/useGlobalReducer";



export const ClockInButton = () => {
  // const { store, dispatch } = useGlobalReducer();

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const token = await localStorage.getItem("token");
  //       if (!token) {
  //         console.log("No hay token, usuario no logueado");
  //         return;
  //       }

  //       try {
  //         const userData = await getUserByToken(token);
  //         console.log("Usuario obtenido:", userData);
  //         setUser(userData);
  //       } catch (error) {
  //         console.error("Error al cargar el usuario:", error);
  //       }
  //     };
  //     fetchUser();
  //   }, []);


  // const onButtonClick = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const created = await addsigning(store.user,{
  //       user_id: store.user.id
  //       schedule_id: scheduleId,
  //       sign_type: newSigning.sign_type,
  //       datetime: toISOString(newSigning.datetime),
  //       lat: newSigning.lat,
  //       long: newSigning.long
  //     },store.userSchedule);
  //     localStorage.setItem("token", created.token);

  //   } catch (err) {
  //     console.error("Error creando usuario:", err);
  //   }
  // }
  return (
    <>
      <button
        className="btn btn-success rounded-circle m-2"
        style={{ width: "120px", height: "120px" }}
      >
        Add worker
      </button>
    </>
  );
};
