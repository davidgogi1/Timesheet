import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddAnEmployee.css";
import { io } from "socket.io-client";
import auth from "../../services/authService";
import { useSelector, useDispatch } from "react-redux";

let user = auth.getCurrentUser();

const options = [
  { value: "USD", label: "USD" },
  { value: "GEL", label: "GEL" },
  { value: "EURO", label: "EURO" },
  { value: "RUB", label: "RUB" },
];

const Employer = () => {
  const [topic, setTopic] = useState({ value: "project1", label: "project1" });
  const [socket, setSocket] = useState(null);
  const [note, setNote] = useState("");
  const [info, setInfo] = useState("");
  const [counter, setCounter] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    specialty: "",
    salaryrate: "",
    currency: "USD",
    date: new Date().toDateString(),
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    specialty: "",
    salaryrate: "",
    project: "",
  });

  const counterA = useSelector((state) => state.counterA);
  const dispatch = useDispatch();

  const decrementA = () => {
    dispatch({ type: "DECA" });
  };

  useEffect(() => {
    setSocket(io("http://localhost:5001"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3900/api/projects")
      .then((response) => {
        const data = response.data;
        setTopic(data);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3900/api/employers")
      .then((response) => {
        const data = response.data;
        setInfo(data);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setCounter(true);

    if (!data.name) {
      errors.name = `"Name" is required.`;
      setErrors(errors);
    }

    if (!data.email) {
      errors.email = `"Email" is required.`;
      setErrors(errors);
    }

    if (!data.specialty) {
      errors.specialty = `"Specialty" is required.`;
      setErrors(errors);
    }

    if (!data.salaryrate) {
      errors.salaryrate = `"Salary rate" is required.`;
      setErrors(errors);
    }

    if (!data.project) {
      errors.project = "Please choose a project.";
      setErrors(errors);
    }

    let obj1 = { x: 0 };
    for (let i = 0; i < topic.length; i++) {
      if (topic[i].name === data.project) {
        for (let j = 0; j < topic[i].people.length; j++) {
          if (topic[i].people[j].email === data.email) {
            setNote(
              "A user with the email " +
                `"${data.email}"` +
                " is already added to this project."
            );
            obj1.x = 2;
            break;
          }
        }
        break;
      }
    }

    if (obj1.x === 0) {
      setNote("");
      for (let i = 0; i < info.length; i++) {
        if (info[i].email === data.email) {
          obj1.x = 1;
          break;
        }
      }
      if (obj1.x === 0) {
        setNote(
          "There is no registered user with the email" + ` "${data.email}".`
        );
      }
    }

    if (
      obj1.x === 1 &&
      !!data.name &&
      !!data.email &&
      !!data.specialty &&
      !!data.salaryrate
    ) {
      let obj = {};
      for (let i = 0; i < topic.length; i++) {
        if (topic[i].name === data.project) {
          obj.id = topic[i]._id;
          obj.people = topic[i].people;
        }
      }

      const blog = {
        name: data.project,
        creator: user.email,
        people: [...obj.people, data],
      };

      fetch(`http://localhost:3900/api/projects/${obj.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });

      setTimeout(() => {
        window.location.reload(false);
      }, 180);

      socket.emit("sendNotification", {
        senderName: user.name + " " + user.surname,
        receiverName: data.email,
        type: "project",
        shown: false,
      });
    }
  };

  const handleChangeSalary = (e) => {
    data.currency = e.target.value;
    setData(data);
    setErrors({ ...errors });
  };

  return (
    <div>
      {counterA ? (
        <div className="popup">
          <div className="popup-inner">
            <button
              className="close-btn"
              onClick={() => {
                decrementA();
              }}
            >
              close
            </button>
            <div className="sign">
              <div className="sign-form">
                <div className="wrapper">
                  <input
                    placeholder="Employee Name"
                    type="text"
                    required
                    onChange={(e) => {
                      data.name = e.target.value;
                      setData(data);
                      setErrors({ ...errors });
                    }}
                  ></input>
                  <div>{!data.name && errors.name}</div>
                  <input
                    placeholder="Employee Email"
                    type="text"
                    required
                    onChange={(e) => {
                      setCounter(false);
                      data.email = e.target.value;
                      setData(data);
                      setErrors({ ...errors });
                    }}
                  ></input>
                  <div>{!data.email && errors.email}</div>
                  <div style={{ width: 320, color: "black" }}>
                    {!!data.email && counter && note}
                  </div>
                  <input
                    placeholder="Specialty"
                    type="text"
                    required
                    onChange={(e) => {
                      data.specialty = e.target.value;
                      setData(data);
                      setErrors({ ...errors });
                    }}
                  ></input>
                  <div>{!data.specialty && errors.specialty}</div>
                  <input
                    placeholder="Salary rate"
                    type="number"
                    required
                    onChange={(e) => {
                      data.salaryrate = parseInt(e.target.value);
                      setData(data);
                      setErrors({ ...errors });
                    }}
                  ></input>
                  <div>{!data.salaryrate && errors.salaryrate}</div>
                  <div className="flex2">
                    <select
                      value={data.currency.value}
                      onChange={handleChangeSalary}
                    >
                      {options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={topic.value}
                      onChange={(e) => {
                        data.project = e.target.value;
                        setData(data);
                        setErrors({ ...errors });
                      }}
                    >
                      <option></option>
                      {topic.length > 0 &&
                        topic.map(
                          (topic) =>
                            topic.creator === user.email && (
                              <option value={topic.name}>{topic.name}</option>
                            )
                        )}
                    </select>
                    <div style={{ width: 320, color: "black" }}>
                      {!data.project && errors.project}
                    </div>
                    <button className="signIn2" onClick={handleSubmit}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Employer;
