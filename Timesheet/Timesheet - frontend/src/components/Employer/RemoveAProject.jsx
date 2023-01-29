import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RemoveAnEmployee.css";
import auth from "../../services/authService";
import Dialog from "./Dialog";
import { useSelector, useDispatch } from "react-redux";

let user = auth.getCurrentUser();

const Employer = () => {
  const [topic, setTopic] = useState({ value: "project1", label: "project1" });
  const [project, setProject] = useState("");
  const [sheet, setSheet] = useState("");
  const [dialog, setDialog] = useState(false);

  const counterR = useSelector((state) => state.counterR);
  const dispatch = useDispatch();

  const decrementR = () => {
    dispatch({ type: "DECR" });
  };

  const areUSureDelete = (choose) => {
    if (choose) {
      handleSubmit1();
      setDialog(false);
    } else {
      setDialog(false);
    }
  };

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
      .get("http://localhost:3900/api/spreadsheets")
      .then((response) => {
        const data = response.data;
        setSheet(data);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  }, []);

  const handleSubmit = () => {
    !!project && setDialog(true);
  };

  const handleSubmit1 = () => {
    let obj = {};
    for (let i = 0; i < topic.length; i++) {
      if (topic[i].name === project) {
        obj.id = topic[i]._id;
        break;
      }
    }

    fetch(`http://localhost:3900/api/projects/${obj.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    for (let i = 0; i < sheet.length; i++) {
      if (sheet[i].project === project) {
        fetch(`http://localhost:3900/api/spreadsheets/${sheet[i]._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    setTimeout(() => {
      window.location.reload(false);
    }, 180);
  };

  return (
    <div>
      {counterR ? (
        <div className="popup1">
          <div className="popup-inner1">
            <button
              className="close-btn1"
              onClick={() => {
                decrementR();
              }}
            >
              close
            </button>
            <div className="sign1">
              <div className="sign-form1">
                <div className="wrapper1">
                  <div className="flex21">
                    <select
                      value={topic.value}
                      onChange={(e) => setProject(e.target.value)}
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
                    <button className="signIn21" onClick={handleSubmit}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {dialog && <Dialog onDialog={areUSureDelete} project={project} />}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Employer;
