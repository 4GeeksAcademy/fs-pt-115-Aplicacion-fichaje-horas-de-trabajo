import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/perfil">
					<span className="navbar-brand mb-0 h1">Logo</span>
				</Link>
				<div className="ml-auto">
					<Link to="/perfil">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};