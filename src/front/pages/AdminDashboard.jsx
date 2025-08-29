export const AdminDashboard = () => {
    return (
        <div className="container-md">
            <div className="col-3 sidebar bg-light p-3 mb-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Active</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
            </div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Here you can manage the application.</p>
        </div>
    );
}