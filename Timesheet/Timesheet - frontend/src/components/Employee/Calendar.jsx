import React, { useState } from "react";
import Calendar from "react-calendar";
import { useHistory } from "react-router-dom";

export function getSunday(d) {
  d = new Date(d);
  return new Date(d.setDate(d.getDate() - d.getDay()));
}

export function CurrentDateRange(d) {
  const current = getSunday(new Date(d));

  const date1 = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  current.setDate(current.getDate() + 7);

  const date2 = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  return (
    <div style={{ width: 360, fontSize: 14 }}>
      The current page shows the data between {date1} and {date2}
    </div>
  );
}

const ReactCalendar = (props) => {
  let project = props.project;
  let minDate = props.date;
  const [date, setDate] = useState(new Date());
  let history = useHistory();

  const maxDate = new Date(2022, 10, 5);

  const onChange = (date) => {
    setDate(date);
    history.push(
      `/employer/spreadsheets/${project}/${Math.floor(
        (date - new Date(2022, 3, 3)) / 1000 / 60 / 60 / 24 / 7
      )}`
    );
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
        minDate={minDate}
        maxDate={maxDate}
      />
      <h1>{CurrentDateRange(date)}</h1>
    </div>
  );
};

export default ReactCalendar;
