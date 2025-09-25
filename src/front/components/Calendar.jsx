import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addschedule, getschedule } from '../services/APIServices';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Calendar = () => {
  const { store, dispatch } = useGlobalReducer()

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    start: '',
    end: ''
  });

  const modalRef = useRef(null)

  //Cargar schedules
  useEffect(() => {
    const loadSchedules = async () => {

      try {
        const data = await getschedule(store.user.id)

        if (!data || !Array.isArray(data)) {
          console.warn("El API no devolvió un array, data recibido:", data);
          return; // evita el .map si no hay datos
        }

        const userScheduleFormatted = data.map(e => ({
          id: e.id,
          user_id: e.user_id,
          start_time: e.start_datetime,
          end_time: e.end_datetime,
        }));
        setEvents(userScheduleFormatted)

        dispatch({ type: "SET_SCHEDULES", payload: data })
      } catch (error) {
        console.error('Error al cargar los schedules:', error);
      }
    };

    loadSchedules();
  }, []);

  const addSchedule = async (start, end) => {
    try {
      const data = await addschedule(store.user.id, start, end)

      dispatch({ type: "ADD_SCHEDULES", payload: data })
    } catch (error) {
      console.error('Error al añadir los schedules:', error);
    }

  }

  // Agregar schedules
  const handleDateClick = async (info) => {
    const date = info.dateStr
    setNewEvent({
      name: store.user.first_name,
      start: `${date}T`,
      end: `${date}T`,
    })

    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();


  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const evento = {
      name: newEvent.name,
      start: newEvent.start,
      end: newEvent.end
    }
    console.log("data enviado", store.user.id, evento.start, evento.end)
    addSchedule()


    setEvents([
      ...events,
      {
        id: data.id,
        name: data.first_name,
        start: data.start_time,
        end: data.end_time
      }
    ])


    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
  }


  return (
    <div className='col-12 d-flex justify-content-center text-dark'>
      <div className="container mt-4 text-dark m-4 bg-light border rounded shadow-sm my-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          editable={false}
          events={events}
          dateClick={handleDateClick}
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

