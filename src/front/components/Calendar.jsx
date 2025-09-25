import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addschedule, getschedule, updateSchedule, deleteSchedule } from '../services/APIServices';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useParams } from 'react-router-dom';

export const Calendar = () => {
  const { store, dispatch } = useGlobalReducer();
  const { id } = useParams()

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    start: '',
    end: ''
  });

  const modalRef = useRef(null);

  // Obtener schedules al cargar
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await getschedule(store.user.id);
        console.log("schedules:", data)
        if (!data || !Array.isArray(data)) {
          console.warn("El API no devolvió un array, recibido:", data);
          return;
        }

        // Adaptar los datos del backend a FullCalendar
        const formatted = data.map(e => ({
          id: e.id,
          start: e.start_time.replace(" ", "T"), // formato ISO para FullCalendar
          end: e.end_time.replace(" ", "T"),
          title: "Turno" // puedes cambiarlo a `${store.user.first_name}` si es siempre el mismo usuario
        }));

        setEvents(formatted);
        dispatch({ type: "SET_SCHEDULES", payload: data });

      } catch (error) {
        console.error("Error al cargar schedules:", error);
      }
    };

    loadSchedules();
  }, []);

  // Crear schedule
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await addschedule(store.user.id, newEvent.start, newEvent.end);

      setEvents([
        ...events,
        {
          id: data.id,
          start: data.start_time.replace(" ", "T"),
          end: data.end_time.replace(" ", "T"),
          title: store.user.first_name
        }
      ]);

      dispatch({ type: "ADD_SCHEDULES", payload: data });

      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };

  // Abrir modal para crear
  const handleDateClick = (info) => {
    const date = info.dateStr;
    setNewEvent({
      name: store.user.first_name,
      start: `${date}T00:00`,
      end: `${date}T01:00`,
    });

    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  // Eliminar schedule
  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`¿Seguro que quieres eliminar este turno?`)) {
      try {
        await deleteSchedule(clickInfo.event.id, id);

        setEvents(events.filter(e => e.id !== clickInfo.event.id));
        dispatch({ type: "DELETE_SCHEDULE", payload: clickInfo.event.id });
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  // Actualizar schedule (drag & drop)
  const handleEventDrop = async (dropInfo) => {
    try {
      const { id } = dropInfo.event;
      const start = dropInfo.event.start.toISOString();
      const end = dropInfo.event.end ? dropInfo.event.end.toISOString() : start;

      // ⚠️ revisa si tu updateSchedule requiere userId
      const updated = await updateSchedule(id, start, end);

      setEvents(events.map(e =>
        e.id === id
          ? { ...e, start: updated.start_time.replace(" ", "T"), end: updated.end_time.replace(" ", "T") }
          : e
      ));

      dispatch({ type: "UPDATE_SCHEDULE", payload: updated });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  return (
    <div className='col-12 d-flex justify-content-center text-dark'>
      <div className="container mt-4 text-dark m-4 bg-light border rounded shadow-sm my-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          editable={true}
          events={events}   // aquí van los fichajes adaptados
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
        />
      </div>

      {/* Modal Crear */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Turno</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre del trabajador</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Inicio</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fin</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar turno
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};