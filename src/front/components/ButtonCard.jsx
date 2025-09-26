import { useNavigate } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";


export const ButtonCard = ({ id, name, rol, state }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${id}`);
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className="w-100 d-flex align-items-center justify-content-between py-3 px-4 mb-2 border rounded shadow-sm bg-light text-start"
                style={{ cursor: "pointer" }}
            >
                <div className="d-flex align-items-center">
                    <img
                        src={rigoImageUrl}
                        className="rounded-circle me-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        alt={name}
                    />

                    <div>
                        <h6 className="mb-1 fw-bold">{name}</h6>
                        <small className="text-muted d-block">{rol}</small>
                        <small
                            className={`d-block fw-semibold ${state === "Activo" ? "text-success" : "text-danger"
                                }`}
                        >
                            {state}
                        </small>
                    </div>
                </div>

                <i className="fa-solid fa-chevron-right text-muted"></i>
            </button>
        </li>
    );
};