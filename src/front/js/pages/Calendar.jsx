import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";

import useAppContext from "../contexts/AppContext.jsx";

moment.locale("es");
const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
  let style = {
    backgroundColor: event.type === "debt" ? "#758bfd" : "#ffaa4d",
    color: "#fff",
    borderRadius: "20px",
    border: "none",
  };
  return {
    style: style,
  };
};

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const { actions } = useAppContext();

  useEffect(() => {
    const roomie_id = localStorage.getItem("roomie_id");
    const fetchCalendarData = async () => {
      try {
        const data = await actions.fetchCalendarData(roomie_id);
        if (data) {
          const formattedData = data.map((event) => {
            return {
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            };
          });
          setEvents(formattedData);
        }
      } catch (error) {
        console.error("Error al obtener los datos del calendario:", error);
      }
    };
    fetchCalendarData();
  }, [actions]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-[50px] p-6 md:p-12 w-full max-w-5xl h-4/5">
        <div className="w-full h-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            style={{ height: "100%", width: "100%", marginBottom: "20px" }}
            messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos para estas fechas.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
