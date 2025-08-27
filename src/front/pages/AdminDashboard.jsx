import { Link } from "react-router-dom"

export const AdminDashboard = () => {
    return (
        <>
            <div className="container">
                <div className="row mt-3 mb-3 d-flex justify-content-between align-items-center">
                    <header className="col-md-9">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome to the admin dashboard</p>
                    </header>
                    <form className="col-md-3 d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Nombre o Apellido" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
                <div>
                    <button>Register new employed</button>
                </div>
                <div>
                    <Link to="/">
                        <span className="btn btn-primary btn-lg" href="#" role="button">
                            Back home
                        </span>
                    </Link>
                </div>
            </div>

        </>
    )
}