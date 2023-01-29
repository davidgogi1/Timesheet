import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Spreadsheets from "./Spreadsheets";
import React, { useState, useEffect } from "react";
import Weekdays from "./Weekdays";
import axios from "axios";
import { getSunday } from "./Calendar";
import auth from "../../services/authService";
import "./Fullspreadsheets.css";

let user = auth.getCurrentUser();

function Fullspreadsheets() {
  const [info, setInfo] = useState([]);

  let obj = {
    projects: [], //Stores the projects assigned to the current user.
    minDates: [], //Stores the array of dates of the first Sunday before a project was assigned to the current user.
    currentWeek: [], //Stores the amounts of weeks passed since a project was assigned to the current user.
    extras: [], //Stores the amounts of weeks passed since the minimum date of "the program" itself up to the creation of a project.
  };

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

  for (let i = 0; i < info.length; i++) {
    for (let j = 0; j < info[i].people.length; j++) {
      if (info[i].people[j].email === user.email) {
        obj.currentWeek = [
          ...obj.currentWeek,
          Math.floor(
            (getSunday(new Date()) -
              getSunday(new Date(info[i].people[j].date))) /
              1000 /
              60 /
              60 /
              24 /
              7
          ),
        ];
        obj.projects = [...obj.projects, info[i].name];

        obj.minDates = [
          ...obj.minDates,
          getSunday(new Date(info[i].people[j].date)),
        ];

        obj.extras = [
          ...obj.extras,
          (getSunday(new Date(info[i].people[j].date)) - new Date(2022, 3, 3)) /
            1000 /
            60 /
            60 /
            24 /
            7,
        ];
      }
    }
  }

  let list = []; //Creating an array of the spreadsheets for each week and for each project.

  for (let j = 0; j < obj.minDates.length; j++) {
    const maxDate = new Date(2022, 10, 5);
    let duration = (maxDate - obj.minDates[j]) / 1000 / 60 / 60 / 24 / 7;
    for (let i = obj.extras[j]; i < duration + obj.extras[j]; i++) {
      let part = (
        <Route path={`/employer/spreadsheets/${obj.projects[j]}/${i}`} key={i}>
          <Spreadsheets
            n={i - obj.extras[j]}
            user={user}
            array={obj.projects[j]}
            duration={duration}
          />
        </Route>
      );
      list.push(part);
    }
  }

  let listR = []; //The page by default gets redirected to the current week.

  for (let j = 0; j < obj.minDates.length; j++) {
    let part = (
      <Redirect
        from={`/employer/spreadsheets/${obj.projects[j]}`}
        exact
        to={`/employer/spreadsheets/${obj.projects[j]}/${
          obj.currentWeek[j] + obj.extras[j]
        }`}
      />
    );
    listR.push(part);
  }

  let listW = []; //Creating an array of the spreadsheets page for each project.

  for (let j = 0; j < obj.minDates.length; j++) {
    let part = (
      <Route path={`/employer/spreadsheets/${obj.projects[j]}`} key={j}>
        <Weekdays
          user={user}
          project={obj.projects[j]}
          date={obj.minDates[j]}
        />
      </Route>
    );
    listW.push(part);
  }

  return obj.projects ? (
    <BrowserRouter>
      <Switch>
        {listW.map((l) => {
          return l;
        })}
      </Switch>
      <div className="datas">
        <Switch>
          {list.map((l) => {
            return l;
          })}
          {listR.map((l) => {
            return l;
          })}
        </Switch>
      </div>
    </BrowserRouter>
  ) : (
    !!info && <h1>Your employer hasn't assigned you any projects yet.</h1>
  );
}

export default Fullspreadsheets;
