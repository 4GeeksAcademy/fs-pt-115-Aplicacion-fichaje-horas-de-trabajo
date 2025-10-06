export const Footer = () => (
	<footer className=" container footer mt-5 p-3 text-center bg-dark text-white shadow rounded-4 border border">
		<p>
			&copy; {new Date().getFullYear()} - ClockIn. All rights reserved.
		</p>
		Developed by:
		<div className="raw d-flex d-block-inline justify-content-around">
			<div className="col-2">
				Nader <a href="https://github.com/Nadee23"><i className="fa-brands fa-github"></i></a> - <a href="https://www.linkedin.com/in/nader-aboud-cubero-80a566190"><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Daniel <a href="https://github.com/daniap03"><i className="fa-brands fa-github"></i></a> - <a href="https://www.linkedin.com/in/daniel-au%C3%B1%C3%B3n-pardo-33778630a/"><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Mili <a href="https://github.com/Mili83666"><i className="fa-brands fa-github"></i></a> - <a href=""><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Michael <a href="https://github.com/mduranm05"><i className="fa-brands fa-github"></i></a> - <a href="https://www.linkedin.com/in/michael-jos%C3%A9-dur%C3%A1n-medina-938219188/"><i className="fa-brands fa-linkedin"></i></a>
			</div>
			<div className="col-2">
				Danny <a href="https://github.com/OsorioDanny"><i className="fa-brands fa-github"></i></a> - <a href="https://www.linkedin.com/in/danny-alejandro-osorio-valencia-888933350/"><i className="fa-brands fa-linkedin"></i></a>
			</div>
		</div>
	</footer>
);
