import { Link } from "react-router-dom";

// Add the image URL or import the image as needed
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const UserCard = () => {
  return (
    <li className="list-group-item col-12 d-flex align-items-center py-2 px-3 mb-2 border rounded shadow-sm">
      <img
        src={rigoImageUrl}
        className="rounded-circle me-3"
        style={{ width: "60px", height: "60px", objectFit: "cover" }}
        alt="User"
      />

      <div className="flex-grow-1">
        <h6 className="mb-1">Name</h6>
        <small className="text-muted d-block">ROLE</small>
        <small className="text-muted d-block">LOCATION</small>
        <small className="text-muted d-block">ESTATE</small>
      </div>

      <div>
        <button type="button" className="btn btn-light btn-sm ms-2">
          <i className="fa-solid fa-pencil"></i>
        </button>
      </div>
    </li>
  );
};
