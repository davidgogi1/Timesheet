import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Employer from "./components/Employer/Employer";
import LoginForm from "./components/Forms/LoginForm";
import RegisterFormEmployer from "./components/Forms/RegisterFormEmployer";
import Logout from "./components/Forms/Logout";
import Footer from "./components/Footer";
import Header from "./components/Header";
import auth from "./services/authService";

const App = () => {
  const user = auth.getCurrentUser();
  return (
    <div className="light-theme en">
      <div className="bg-wrapper-light"></div>
      <ToastContainer />
      <Header />
      <Switch>
        <Route path="/registerEmployer" component={RegisterFormEmployer} />
        <Route path="/login" component={LoginForm} />
        <Route path="/logout" component={Logout} />
        <Route path="/employer" component={Employer} />
        {!user && <Redirect from="/" exact to="/login" />}
        {user && <Redirect from="/" exact to="/employer/home" />}
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
