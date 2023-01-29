import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Employer.css";
import Navbar from "./Navbar";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";

import house from "../EmployerData/img/house-door-fill-blue.svg";
import circle from "../EmployerData/img/Circle-information.svg";
import document from "../EmployerData/img/document-svgrepo-com.svg";
import newP from "../EmployerData/img/PngItem_3024056.png";
import add from "../EmployerData/img/add-user-2-64.png";
import remove from "../EmployerData/img/delete-24.png";

const Employees = (props) => {
  const [projectnew, setProjectNew] = useState("");
  const [info, setInfo] = useState("");
  const [note, setNote] = useState("");
  const [socket, setSocket] = useState(null);
  let user = props.user;

  const dispatch = useDispatch();

  const incrementA = () => {
    dispatch({ type: "INCA" });
  };

  const incrementR = () => {
    dispatch({ type: "INCR" });
  };

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    !!socket && socket.emit("newUser", user.email);
  }, [socket, user.email]);

  const getAll = useCallback(() => {
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

  const Add_project = (e) => {
    e.preventDefault();
    let obj = { x: 0 };
    for (let i = 0; i < info.length; i++) {
      if (info[i].name === projectnew) {
        setNote(projectnew + " already exists.");
        obj.x = 1;
        break;
      }
    }

    if (obj.x === 0) {
      const blog = {
        name: projectnew,
        creator: user.email,
        people: [],
      };

      fetch("http://localhost:3900/api/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });

      setTimeout(() => {
        window.location.reload(false);
      }, 180);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  let history = useHistory();

  const handleChangeSpreadsheets = (e) => {
    for (var i = 0; i < info.length; i++) {
      if (e === info[i].name) {
        history.push(`/Employer/spreadsheets/${e}`);
        window.location.reload();
      }
    }
  };

  let list = [];

  for (let j = 0; j < info.length; j++) {
    for (let i = 0; i < info[j].people.length; i++) {
      info[j].people[i].email === user.email &&
        (list = [...list, info[j].name]);
    }
  }

  return (
    <div className="Employer">
      <div className="dropdownX">
        <a href="/employer/home">
          <span style={{ color: "blue" }}>Home</span>
          <img src={house} alt="logo" />
        </a>
      </div>
      <div>
        <div className="dropdownX">
          <a href="/employer/projects">
            <span style={{ color: "blue" }}>Projects</span>
            <img src={circle} alt="logo" />
          </a>
        </div>
      </div>
      <div className="dropdownX">
        <span>Spreadsheets</span>
        <img src={document} alt="logo" />
        <div className="contents">
          <select onChange={(e) => handleChangeSpreadsheets(e.target.value)}>
            <option></option>
            {list.map((project) => (
              <option key={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="dropdownX">
          <span>Add a project</span>
          <img src={newP} alt="logo" />
          <div className="contents">
            <input
              placeholder="New Project"
              type="text"
              onChange={(e) => setProjectNew(e.target.value)}
            ></input>
            <div style={{ color: "red", fontSize: 16 }}>{note}</div>
            <button onClick={Add_project}>Add</button>
          </div>
        </div>
      </div>
      <div onClick={incrementA} className="nav_action">
        <span>Add an employee</span>
        <img src={add} alt="logo" />
      </div>
      <div onClick={incrementR} className="nav_action">
        <span>Remove a project</span>
        <img src={remove} alt="logo" />
      </div>
      {!!socket && <Navbar socket={socket} />}
    </div>
  );
};

export default Employees;
