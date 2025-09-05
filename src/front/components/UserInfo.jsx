export const UserInfo = ({ firstName, totalHours, breakHours, regularHours, absence, overtime }) => {
    return (
        <tr>
            <td>{firstName}</td>
            <td>{totalHours}</td>
            <td>{breakHours}</td>
            <td>{regularHours}</td>
            <td>{overtime}</td>
            <td>{absence}</td>
        </tr>
    );
}