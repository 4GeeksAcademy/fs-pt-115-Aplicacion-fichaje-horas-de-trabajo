import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Profile } from "../pages/Profile";

export const ButtonCard = ({ id, name, rol, state, image }) => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleClick = () => {
        if (store.user.is_admin) {
            navigate(`/profile/${id}`);
        }
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className="w-100 d-flex align-items-center justify-content-between py-3 px-4 mb-2 border rounded shadow-sm bg-dark text-light text-start"
                style={{ cursor: store.user.is_admin ? "pointer" : "not-allowed" }}
                disabled={!store.user.is_admin}
            >
                <div className="d-flex align-items-center">
                    <img
                        src={image || "https://static.thenounproject.com/png/881504-200.png"}
                        className="rounded-circle me-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        alt={name}
                    />

                    <div>
                        <h6 className="mb-1 fw-bold">{name}</h6>
                        <small className=" d-block text-light">{rol}</small>
                        <small
                            className={`d-block fw-semibold ${state === "Active" ? "text-success" : "text-danger"
                                }`}
                        >
                            {state}
                        </small>
                    </div>
                </div>

                <i className="fa-solid fa-chevron-right text-light"></i>
            </button>
        </li>
    );
};