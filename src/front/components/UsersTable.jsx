// UsersTableRows.jsx
import { useNavigate } from "react-router-dom";

export const UsersTable = ({ users, isAdmin }) => {
  const navigate = useNavigate();

  const handleClick = (userId) => {
    if (isAdmin) navigate(`/profile/${userId}`);
  };

  return (
    <>
      {users.map((user) => (
        <tr className="border rounded shadow-sm bg-dark" key={user.id}>
          <td>
            {isAdmin ? (
              <button
                className="btn btn-link p-0 text-link"
                onClick={() => handleClick(user.id)}
              >
                {user.first_name}
              </button>
            ) : (
              <span>{user.first_name}</span>
            )}
          </td>
          <td className="text-end">{user.total_hours ?? 0}</td>
          <td className="text-end">{user.regular_hours ?? 0}</td>
          <td className="text-end">{user.month_hours ?? 0}</td>
        </tr>
      ))}
    </>
  );
};