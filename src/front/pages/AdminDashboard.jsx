import React from "react";

export default function FechaActual() {
  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <p>{fecha}</p>;
}

export const AdminDashboard = () => {
  return (
    <div className="container-md">
      <div className="row">
        <div className="col-md-4">
          <div className="text-bg-warning p-2 text-center rounded-4">
            <h1>Hello Admin, Welcome</h1>
            {FechaActual()}
          </div>
          <div className="mt-5">
            <h3 className="text-center">Who's In</h3>
            <h6>Working</h6>
            <h6>Work Remotely</h6>
            <h6>Break</h6>

          
            <h6>In Hollidays</h6>
          </div>
        </div>
        <div className="col-md-4">
          <h3 className="text-center">Documents</h3>
        </div>
        <div className="col-md-4">
          <h3 className="text-center">Requests</h3>
          <h3 className="text-center">News!</h3>
        </div>
      </div>
    </div>
  );
};
