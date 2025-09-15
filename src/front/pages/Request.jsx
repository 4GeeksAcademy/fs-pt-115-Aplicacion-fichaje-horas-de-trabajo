import { ButtonRequest } from "../components/ButtonRequest";
import { UserCard } from "../components/UserCard";

export const Request = () => {
  return (
    <div className="container">
      <h1 className="m-2">Request Page</h1>
      <hr className="text-light" />
      <h5>solicitudes pendientes</h5>
      <div>
        <UserCard />
        <ButtonRequest />
      </div>
      <div>
        <UserCard />
        <ButtonRequest />
      </div>
      <hr className="text-light" />
      <h5>solicitudes aceptadas</h5>
      <UserCard />
      <hr className="text-light" />
      <h5>solicitudes rechazadas</h5>
      <UserCard />
      <hr className="text-light" />
      <h5>solicitudes canceladas</h5>
      <UserCard />
      <hr className="text-light" />
      <h5>solicitudes finalizadas</h5>
      <UserCard />
    </div>
  );
};
