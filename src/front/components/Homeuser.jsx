import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Homeuser = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <div className="text-center">
            <h1>Bienvenido Bob</h1>
            <button type="button" class="btn btn-primary rounded-circle" data-bs-toggle="button">
                Start
            </button>
            <button type="button" class="btn btn-primary active rounded-circle" data-bs-toggle="button">
                End
            </button>
            

            <button type="button" class="btn btn-info">Subir documentacion</button>
        </div>



    )
}