// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Loginpage } from "./pages/Loginpage";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import CheckFirstUserRoute from "./components/CheckFirstUserRoute";
import { Request } from "./pages/Request";
import ProtectedRoutes from "./components/ProtectedRoutes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    
      
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

<Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
  
  <Route element={<ProtectedRoutes/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/profile" element={<Profile/>} />
    <Route path="/admin/request" element={<Request/>} />
    <Route path="/admin/signup" element={<SignUp/>} />
    <Route path="/admin" element={<AdminDashboard/>} />
  </Route>

  {/* Protege la ruta si ya hay usuarios */}
  <Route element={<CheckFirstUserRoute blockIfUsersExist={true} redirectTo="/login" />}>
    <Route path="/signup" element={<SignUp/>} />
  </Route>

  {/* Protege la ruta si aún NO hay usuarios */}
  <Route element={<CheckFirstUserRoute blockIfUsersExist={false} redirectTo="/signup" />}>
    <Route path="/login" element={<Loginpage/>} />
  </Route>
  
</Route>
    )
);