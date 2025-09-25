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
        <tr key={user.id}>
          <td>
            {isAdmin ? (
              <button
                className="btn btn-link p-0 text-white"
                onClick={() => handleClick(user.id)}
              >
                {user.first_name}
              </button>
            ) : (
              <span>{user.first_name}</span>
            )}
          </td>
          <td className="text-end">{user.total_hours ?? 0}</td>
          <td className="text-end">{user.break_hours ?? 0}</td>
          <td className="text-end">{user.regular_hours ?? 0}</td>
          <td className="text-end">{user.overtime ?? 0}</td>
          <td className="text-end">{user.absence ?? 0}</td>
        </tr>
      ))}
    </>
  );
};