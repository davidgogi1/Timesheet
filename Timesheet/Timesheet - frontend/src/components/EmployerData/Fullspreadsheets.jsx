import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Spreadsheets from "./Spreadsheets";
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { getSunday } from "./Calendar";

import auth from "../../services/authService";

let user = auth.getCurrentUser();

function Fullspreadsheets() {
  const [info, setInfo] = useState("");

  let obj = {
    projects: [],
    people: [],
    names: [],
    minDates: [],
    extras: [],
    currentWeek: [],
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
    if (info[i].creator === user.email) {
      for (let j = 0; j < info[i].people.length; j++) {
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
        obj.people = [...obj.people, info[i].people[j].email];
        obj.names = [...obj.names, info[i].people[j].name];

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

  let list = [];
  let duration =
    (new Date(2022, 10, 5) - new Date(2022, 3, 3)) / 1000 / 60 / 60 / 24 / 7;

  let currentWeek =
    1 +
    Math.floor(
      getSunday(new Date() - new Date(2022, 3, 3)) / 1000 / 60 / 60 / 24 / 7
    );

  for (let i = 0; i < duration; i++) {
    let list0 = [];
    for (let j = 0; j < obj.minDates.length; j++) {
      let part = (
        <Spreadsheets
          key={j}
          n={i - obj.extras[j]}
          user={obj.people[j]}
          name={obj.names[j]}
          arrayF={obj.projects[j]}
        />
      );

      list0.push(part);
    }
    list.push(
      <Route path={`/employer/home/${i}`} key={i}>
        {list0.map((l) => {
          return l;
        })}
      </Route>
    );
  }

  return obj.projects ? (
    <BrowserRouter>
      <div className="datas1">
        <Calendar />
        <Switch>
          <div>
            {list.map((l) => {
              return l;
            })}
            <Redirect
              from={`/employer/home/`}
              exact
              to={`/employer/home/${currentWeek}`}
            />
          </div>
        </Switch>
      </div>
    </BrowserRouter>
  ) : (
    !!info && <h1>Your employer hasn't assigned you any projects yet.</h1>
  );
}

export default Fullspreadsheets;
