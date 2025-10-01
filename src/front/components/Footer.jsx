export const Footer = () => (
	<footer className=" container footer mt-5 p-3 text-center bg-dark text-white shadow rounded-4 border border">
		<p>
			&copy; {new Date().getFullYear()} - ClockIn. All rights reserved.
		</p>
		Developed by:
		<div className="raw d-flex d-block-inline justify-content-around">
			<div className="col-2">
				Nader <a href=""><i className="fa-brands fa-github"></i></a> - <a href=""><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Daniel <a href=""><i className="fa-brands fa-github"></i></a> - <a href=""><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Mili <a href=""><i className="fa-brands fa-github"></i></a> - <a href=""><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Michael <a href=""><i className="fa-brands fa-github"></i></a> - <a href=""><i class="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Danny <a href="https://github.com/OsorioDanny"><i className="fa-brands fa-github"></i></a> - <a href=""><i className="fa-brands fa-linkedin"></i></a>
			</div>
		</div>
	</footer>
);
