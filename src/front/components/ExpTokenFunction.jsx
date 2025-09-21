import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../services/comprobarToken";

export function comproveAuth(){
    const navigate = useNavigate();

    useEffect (() => {
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)){
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
    },[navigate]);
}