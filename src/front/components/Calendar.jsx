import { useEffect, useState, useRef } from 'react';
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
        const data = await getschedule(id, dispatch);
        const formatted = data.map(e => ({
          id: e.id,
          start: e.start_time.replace(" ", "T"),
          end: e.end_time.replace(" ", "T"),
          title: "Turno",
        }));
        setEvents(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    loadSchedules();
  }, [id]);

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
      name: id,
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
        await deleteSchedule(Number(id), clickInfo.event.id, dispatch);

        window.location.reload();
        setEvents(prev => prev.filter(e => e.id !== clickInfo.event.id));

      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  const formatToTime = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Actualizar schedule (drag & drop)
  const handleEventDrop = async (dropInfo) => {
    try {
      const scheduleId = dropInfo.event.id;
      const startDate = dropInfo.event.start;
      const endDate = dropInfo.event.end || startDate;

      const updates = {
        start_time: startDate.toISOString(), // ej: 2025-09-28T09:27:00.000Z
        end_time: endDate.toISOString(),
      };


      const updated = await updateSchedule(Number(id), scheduleId, updates);

      setEvents((prev) =>
        prev.map((e) =>
          String(e.id) === String(scheduleId)
            ? {
              ...e,
              start: updated.start_time.replace(" ", "T"),
              end: updated.end_time.replace(" ", "T"),
            }
            : e
        )
      );

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
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
        />
      </div>

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