import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import { handleSubmit, handleChange } from "./Form";
import auth from "../../services/authService";
import "./LoginForm.css";
import { NavLink } from "react-router-dom";

const LoginForm = (props) => {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().required().label("E-mail"),
    password: Joi.string().required().label("Password"),
  };

  const doSubmit = async () => {
    try {
      const data1 = data;
      await auth.login(data1.username, data1.password);
      const { state } = props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors1 = { ...errors };
        errors1.username = ex.response.data;
        setErrors(errors1);
      }
    }
  };

  if (auth.getCurrentUser()) return <Redirect to="/" />;

  return (
    <div className="landing-content">
      <section className="content__main">
        <h1>Pay instantly with payBitX</h1>
        <span>
          the smartest crypto wallet , payment API and invoice generator; First
          bitcoin P2P payment platform; JOIN payBitX
        </span>
        <div className="landing-currencies"></div>
      </section>
      <div className="sign-in">
        <form
          className="sign-in-form"
          onSubmit={(e) => handleSubmit(e, data, schema, setErrors, doSubmit)}
        >
          <h1>Sign In</h1>
          <div className="input-wrapper">
            <label>Enter your E-mail</label>
            <input
              type="text"
              name="username"
              value={data["username"]}
              label="Enter your e-mail"
              onChange={(e) =>
                handleChange(e, data, errors, setData, setErrors, schema)
              }
              error={errors["username"]}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={data["password"]}
              label="Password"
              onChange={(e) =>
                handleChange(e, data, errors, setData, setErrors, schema)
              }
              error={errors["password"]}
            />
            {errors["username"] && <p>{errors["username"]}</p>}
            {errors["password"] && <p>{errors["password"]}</p>}
            <input type="submit" className="signIn-btn" value="Sign In" />
          </div>
        </form>
        <NavLink to="/registerEmployer">
          <button className="signIn-btn2">Sign Up Employer</button>
        </NavLink>
      </div>
    </div>
  );
};

export default LoginForm;
