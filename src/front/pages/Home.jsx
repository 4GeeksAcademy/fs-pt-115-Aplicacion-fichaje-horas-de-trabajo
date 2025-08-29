import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <div className="text-center">
            <h1>Login</h1>
    
        </div>



    )
}
