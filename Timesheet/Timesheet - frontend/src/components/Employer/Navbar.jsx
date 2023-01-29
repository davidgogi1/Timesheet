import "./Navbar.css";
import notificationCopy from "../EmployerData/img/notification.svg";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [info, setInfo] = useState("");
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3900/api/notifications")
      .then((response) => {
        const data = response.data;
        setInfo(data);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  });

  const clearNotifications = () => {
    let obj = {};
    for (var i = 0; i < info.length; i++) {
      obj.x = info[i]._id;
      const blog = {
        senderName: info[i].senderName,
        receiverName: info[i].receiverName,
        type: info[i].type,
        shown: true,
      };

      fetch(`http://localhost:3900/api/notifications/${obj.x}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
    }
  };

  useEffect(() => {
    socket.on("getNotification", (data) => {
      data.shown === false && setVisible((x) => x + 1);
      setNotifications((prev) => [data, ...prev]);
    });
  }, [socket]);

  const displayNotification = ({ senderName, type }) => {
    if (type === "submit") {
      return (
        <span className="notification">{`${senderName} submitted the hours for the current month.`}</span>
      );
    }

    if (type === "project") {
      return (
        <span className="notification">{`${senderName} added a project for you.`}</span>
      );
    }
  };

  return (
    <div className="navbar">
      <div className="icons">
        <div
          className="icon"
          onClick={() => {
            setOpen(!open);
            setShow(false);
            clearNotifications();
          }}
        >
          <img src={notificationCopy} className="iconImg" alt="" />

          {visible > 0 && show && <div className="counter">{visible}</div>}
        </div>
      </div>
      {open && (
        <div className="notifications">
          {notifications.map((n) => displayNotification(n))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
