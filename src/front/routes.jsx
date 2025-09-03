// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SingUp } from "./pages/SingUp";
import { Loginpage } from "./pages/Loginpage";
import { PerfilNew } from "./pages/PerfilNew";






export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Root Route: All navigation will start from here. */}
            <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
                {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
                <Route path="/" element={<Home />} />
                <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
                <Route path="/demo" element={<Demo />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/singup" element={<SingUp />} />
            </Route>
            <Route path="/login" element={<Loginpage />} />
            <Route path="/admin/perfilnew" element={<PerfilNew />} />
        </>
    )
);