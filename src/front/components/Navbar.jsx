import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<div className="container mb-3">
		<nav className="navbar bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					<i className="fa-solid fa-clock"></i>
						ClockIn
				</a>

			</div>
		</nav>
		</div>
	);
};