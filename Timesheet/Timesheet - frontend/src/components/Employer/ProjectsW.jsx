import React, { useState, useEffect, useCallback } from "react";
import "./Employer.css";
import axios from "axios";
import auth from "../../services/authService";

let user = auth.getCurrentUser();

const Projects = () => {
  const [info, setInfo] = useState("");

  const getTopics = useCallback(() => {
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
    getTopics();
  }, []);

  let projects = (
    <div>
      {!!info && (
        <ul className="projects">
          {info.map((l) => {
            return l.creator === user.email && <li>{l.name}</li>;
          })}
        </ul>
      )}
    </div>
  );

  return projects;
};

export default Projects;
