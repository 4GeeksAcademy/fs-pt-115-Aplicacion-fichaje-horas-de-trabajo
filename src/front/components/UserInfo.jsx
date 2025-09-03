export const UserInfo = ({ firstName, totalHours, lastCheckIn, lastCheckOut, absence }) => {
    return (
        <tr>
            <td>{firstName}</td>
            <td>{totalHours}</td>
            <td>{lastCheckIn}</td>
            <td>{lastCheckOut}</td>
            <td>{absence}</td>
        </tr>
    );
}