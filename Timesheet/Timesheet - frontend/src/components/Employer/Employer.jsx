import React from "react";
import { Route, Switch } from "react-router-dom";
import "./Employer.css";
import Fullspreadsheets from "../Employee/Fullspreadsheets";
import Fullspreadsheets1 from "../EmployerData/Fullspreadsheets";
import ProjectsW from "./ProjectsW";
import Page from "./Page";
import RemoveAProject from "./RemoveAProject";
import AddAnEmployee from "./AddAnEmployee";
import auth from "../../services/authService";

let user = auth.getCurrentUser();

const Employer = () => {
  return (
    <div>
      <Page user={user} />
      <RemoveAProject />
      <AddAnEmployee />
      <Switch>
        <Route path="/employer/home" component={Fullspreadsheets1} />
        <Route path="/employer/projects" component={ProjectsW} />
        <Route path="/employer/spreadsheets" component={Fullspreadsheets} />
      </Switch>
    </div>
  );
};

export default Employer;
