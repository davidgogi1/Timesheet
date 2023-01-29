import React, { useState } from "react";
import Calendar from "react-calendar";
import { useHistory } from "react-router-dom";
import { CurrentDateRange } from "../Employee/Calendar";
import calendar from "./img/calendar-symbol-svgrepo-com.svg";

export function getSunday(d) {
  d = new Date(d);
  return new Date(d.setDate(d.getDate() - d.getDay()));
}

const ReactCalendar = () => {
  const [date, setDate] = useState(new Date());
  const minDate = new Date(2022, 3, 3);
  const maxDate = new Date(2022, 10, 5);
  let history = useHistory();
  const onChange = (date) => {
    setDate(date);
    history.push(
      `/employer/home/${Math.floor((date - minDate) / 1000 / 60 / 60 / 24 / 7)}`
    );
  };

  return (
    <div>
      <div className="menu">
        <span style={{ display: "flex" }}>
          Calendar
          <img
            style={{ width: 18, marginLeft: "4px" }}
            src={calendar}
            alt="logo"
          />
        </span>
        <div className="menu-1">
          <Calendar
            onChange={(e) => onChange(e)}
            value={date}
            minDate={minDate}
            maxDate={maxDate}
          />
          <h1>{CurrentDateRange(date)}</h1>
        </div>
      </div>
    </div>
  );
};

export default ReactCalendar;
