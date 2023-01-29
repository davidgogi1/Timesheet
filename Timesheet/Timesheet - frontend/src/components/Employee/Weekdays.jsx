import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { io } from "socket.io-client";
import calendar from "../EmployerData/img/calendar-symbol-svgrepo-com.svg";

function CurrentDate() {
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  return <div>The current date is {date}</div>;
}

export default function Weekdays(props) {
  const [info, setInfo] = useState("");
  const [socket, setSocket] = useState(null);
  const [employer, setEmployer] = useState("");

  let user = props.user;
  let project = props.project;
  let date = props.date;

  useEffect(() => {
    setSocket(io("http://localhost:5001"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3900/api/projects")
      .then((response) => {
        const data = response.data;
        setInfo(data);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  }, []);

  useEffect(() => {
    for (let i = 0; i < info.length; i++) {
      if (info[i].name === project) {
        setEmployer(info[i].creator);
      }
    }
  });

  const handleNotification = () => {
    !!employer &&
      socket.emit("sendNotification", {
        senderName: user.name + " " + user.surname,
        receiverName: employer,
        type: "submit",
        shown: false,
      });

    window.location.reload();
  };

  return (
    <div className="temp">
      {CurrentDate()}
      <div className="calendar">
        Calendar
        <img style={{ width: 26, padding: "4px" }} src={calendar} alt="logo" />
        <div className="menu-1">
          <Calendar project={project} date={date} />
        </div>
      </div>
      <button className="button" onClick={() => handleNotification()}>
        Submit
      </button>
    </div>
  );
}
