import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
// Add the image URL or import the image as needed
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const UserCard = (latitude, longitude, date, type) => {
  const { store, dispatch } = useGlobalReducer();

  return (
    <li className="list-group-item col-12 d-flex align-items-center py-2 px-3 mb-2 border rounded shadow-sm bg-light">
      <img
        src={rigoImageUrl}
        className="rounded-circle me-3"
        style={{ width: "60px", height: "60px", objectFit: "cover" }}
        alt="User"
      />

      <div className="flex-grow-1">
        <h6 className="mb-1">{store.user.first_name}</h6>
        <small className="text-muted d-block">{store.user.rol}</small>
        {/* Información del fichaje */}
        <div className="mt-2">
          <small className="d-block">
            <strong>Latitude:</strong> {latitude}
          </small>
          <small className="d-block">
            <strong>Longitude:</strong> {longitude}
          </small>
          <small className="d-block">
            <strong>Datetime:</strong> {date}
          </small>
          <small className="d-block">
            <strong>Type:</strong> {type}
          </small>
        </div>
      </div>

      <div>
        {/* Edit y Delete user*/}
        <button type="button" className="btn btn-danger btn-sm ms-2">
          <i className="fa-solid fa-trash"></i>
        </button>
        <button type="button" className="btn btn-light btn-sm ms-2">
          <i className="fa-solid fa-pencil"></i>
        </button>
      </div>
    </li>
  );
};
