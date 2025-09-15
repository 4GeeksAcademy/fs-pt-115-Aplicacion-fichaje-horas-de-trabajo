import { ButtonRequest } from "../components/ButtonRequest";
import { UserCard } from "../components/UserCard";

export const Request = () => {
  return (
    <div className="container-fluid">
      <button
        className="btn btn-primary my-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
      >
        Index
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 id="sidebarMenuLabel">Sections</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href="#pending">
                Pending Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#accept">
                Accepted Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#denied">
                Denied Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#canceled">
                Canceled Requests
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#completed">
                Completed Requests
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container d-flex flex-column align-items-center">
        <h1 className="m-2">Request Page</h1>
        <hr className="text-light" />
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="pending">Pending Request</h5>
          <div>
            <UserCard />
            <ButtonRequest />
          </div>
          <div>
            <UserCard />
            <ButtonRequest />
          </div>
          <div>
            <UserCard />
            <ButtonRequest />
          </div>
          <div>
            <UserCard />
            <ButtonRequest />
          </div>
          <div>
            <UserCard />
            <ButtonRequest />
          </div>
        </div>
        <hr className="text-light" />
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="accept">Accept Requests</h5>
          <UserCard />
        </div>
        <hr className="text-light" />
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="denied">Denied Requests</h5>
          <UserCard />
        </div>
        <hr className="text-light" />
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="canceled">Cancel Requests</h5>
          <UserCard />
        </div>
        <hr className="text-light" />
        <div
          className="p-2 overflow-y-auto"
          style={{ width: "50%", height: "200px" }}
        >
          <h5 id="completed">Completed Requests</h5>
          <UserCard />
        </div>
      </div>
    </div>
  );
};
