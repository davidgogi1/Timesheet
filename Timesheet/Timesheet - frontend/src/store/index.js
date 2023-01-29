//We use this reducer to be able to control opening and closing of
//"Add an employee" and "Remove a project" popups from different files.

import { configureStore } from "@reduxjs/toolkit";

const reducer = (state = { counterA: 0, counterR: 0 }, action) => {
  if (action.type === "INCA") {
    return { counterA: 1 };
  }

  if (action.type === "INCR") {
    return { counterR: 1 };
  }

  if (action.type === "DECA") {
    return { counterA: 0 };
  }

  if (action.type === "DECR") {
    return { counterR: 0 };
  }

  return state;
};

const store = configureStore({ reducer });

export default store;
