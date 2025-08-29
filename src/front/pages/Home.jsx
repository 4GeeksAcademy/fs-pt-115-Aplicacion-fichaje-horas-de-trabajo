import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Login } from "../components/Login.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <div className="text-center">
            <h1>Login</h1>
    
        </div>


			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="ml-auto">
			<Link to="/admin">
				<button className="btn btn-primary">Check the Context in action</button>
			</Link>
		</div>
	);
}; 

