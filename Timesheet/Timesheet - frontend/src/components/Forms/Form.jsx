import Joi from "joi-browser";

const validate = (data, schema) => {
  const options = { abortEarly: false };
  const { error } = Joi.validate(data, schema, options);
  if (!error) {
    return null;
  }
  const errors = {};
  for (let item of error.details) errors[item.path[0]] = item.message;
  return errors;
};

const validateProperty = ({ name, value }, schema) => {
  const obj = { [name]: value };
  const schema1 = { [name]: schema[name] };
  const { error } = Joi.validate(obj, schema1);
  return error ? error.details[0].message : null;
};

const handleSubmit = (e, data, schema, setErrors, func) => {
  e.preventDefault();
  const errors1 = validate(data, schema);
  setErrors(errors1 || {});
  if (errors1) return;
  func();
};

const handleChange = (e, data, errors, setData, setErrors, schema) => {
  const errors1 = { ...errors };
  const errorMessage = validateProperty(e.currentTarget, schema);
  if (errorMessage) errors1[e.currentTarget.name] = errorMessage;
  else delete errors1[e.currentTarget.name];

  const data1 = { ...data };
  data1[e.currentTarget.name] = e.currentTarget.value;
  setErrors(errors1);
  setData(data1);
};

export { validate, validateProperty, handleSubmit, handleChange };
