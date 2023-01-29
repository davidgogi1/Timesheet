import React, { useState } from "react";
import Joi from "joi-browser";
import { handleSubmit, handleChange } from "./Form";
import { register } from "../../services/userServiceEmployer";
import auth from "../../services/authService";

const RegisterForm = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
    name: "",
    surname: "",
    date: new Date().toDateString(),
  });

  const [errors, setErrors] = useState({});

  const schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(5).label("Password"),
    passwordRepeat: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .options({ language: { any: { allowOnly: "must match Password" } } })
      .label("Confirm Password"),
    name: Joi.string().required().label("Name"),
    surname: Joi.string().required().label("Surname"),
    date: Joi.string().required().label("Date"),
  };

  const doSubmit = async () => {
    try {
      const response = await register(data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors1 = { ...errors };
        errors1.username = ex.response.data;
        setErrors(errors1);
      }
    }
  };

  return (
    <div className="landing-content-register">
      <div className="sign-in">
        <form
          className="sign-in-form"
          onSubmit={(e) => handleSubmit(e, data, schema, setErrors, doSubmit)}
        >
          <h1>Register</h1>
          <div className="input-wrapper">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={data["email"]}
              label="Email"
              onChange={(e) => {
                handleChange(e, data, errors, setData, setErrors, schema);
              }}
              error={errors["email"]}
            />
            {!!errors.email && (
              <p style={{ color: "purple" }}>{errors.email}</p>
            )}
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
            {!!errors.password && (
              <p style={{ color: "purple" }}>{errors.password}</p>
            )}
            <label>Confirm Password</label>
            <input
              type="password"
              name="passwordRepeat"
              value={data["passwordRepeat"]}
              label="Confirm Password"
              onChange={(e) =>
                handleChange(e, data, errors, setData, setErrors, schema)
              }
              error={errors["passwordRepeat"]}
            />

            {!!errors.passwordRepeat &&
              data.passwordRepeat != data.password && (
                <p style={{ color: "purple" }}>{errors.passwordRepeat}</p>
              )}
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={data["name"]}
              label="Name"
              onChange={(e) =>
                handleChange(e, data, errors, setData, setErrors, schema)
              }
              error={errors["name"]}
            />
            {!!errors.name && <p style={{ color: "purple" }}>{errors.name}</p>}
            <label>Surname</label>
            <input
              type="text"
              name="surname"
              value={data["surname"]}
              label="Surname"
              onChange={(e) =>
                handleChange(e, data, errors, setData, setErrors, schema)
              }
              error={errors["surname"]}
            />
            {!!errors.surname && (
              <p style={{ color: "purple" }}>{errors.surname}</p>
            )}
            <input type="submit" className="signIn-btn" value="Register" />
            {!!errors.username && (
              <p style={{ color: "purple" }}>{errors.username}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
