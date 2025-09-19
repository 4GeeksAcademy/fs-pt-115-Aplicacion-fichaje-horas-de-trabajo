export const UserInfo = ({ firstName, totalHours, breakHours, regularHours, overtime, absence }) => {
  return (
    <tr>
      <td>{firstName}</td>
      <td className="text-end">{totalHours}</td>
      <td className="text-end">{breakHours}</td>
      <td className="text-end">{regularHours}</td>
      <td className="text-end">{overtime}</td>
      <td className="text-end">{absence}</td>
    </tr>
  );
};