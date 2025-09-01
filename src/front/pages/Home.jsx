import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Login } from "../components/Login.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer()
    return(
        <div className="Home">
            <div className="container-fluid border rounded shadow-sm my-4 p-3 me-5">
                <div className="row">
                    <ul className="col-6 ">
                        <h4>WORKING</h4>
                        <UserCard />
                        <UserCard />
                        <UserCard />
                    </ul>

                    <ul className="col-6 ">
                        <h4>NOT WORKING</h4>
                        <UserCard />
                        <UserCard />
                        <UserCard />
                    </ul>

                    <ul className="col-6 ">
                        <h4>BREAK</h4>
                        <UserCard />
                        <UserCard />
                        <UserCard />
                    </ul>

                    <ul className="col-6 ">
                        <h4>HOLIDAYS</h4>
                        <UserCard />
                        <UserCard />
                        <UserCard />
                    </ul>



                    </div>
                </div>
            </div>
            
            )
        }   