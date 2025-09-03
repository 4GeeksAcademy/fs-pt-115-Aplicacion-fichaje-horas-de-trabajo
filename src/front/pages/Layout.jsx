import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Login } from "../components/Login"



// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            
                <Outlet />
           
        </ScrollToTop>
    )
}