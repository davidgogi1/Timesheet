import React, { useState, useEffect, useCallback, useRef } from "react";
import Spreadsheet from "react-spreadsheet";
import axios from "axios";

const Spreadsheets = (props) => {
  let n = props.n;
  let user = props.user;
  let name = props.name;
  let arrayF = props.arrayF;

  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState();

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

  const getBlogPost = useCallback(() => {
    !!info &&
      axios
        .get("http://localhost:3900/api/spreadsheets")
        .then((response) => {
          const data = response.data;
          const data_per_user = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].email === user && data[i].project === arrayF) {
              data_per_user.push(data[i]);
            }
          }

          if (data_per_user.length >= 7 * (n + 1)) {
            setPosts(data_per_user);
          }
        })
        .catch(() => {
          alert("Error retrieving data!!!");
        });
  }, [n, info]);

  const displayBlogPost = useCallback(() => {
    let list = [];
    let mini_list = [];

    let sum_column = 0;
    if (Array.isArray(posts)) {
      mini_list = [];
      for (let i = 0; i < 7; i++) {
        mini_list.push({ value: posts[7 * n + i].value });
      }
      for (let i = 0; i < 7; i++) {
        sum_column += parseInt(posts[7 * n + i].value);
      }
      mini_list.push({ value: sum_column });
      list.push(mini_list);
      sum_column = 0;
    }
    return list;
  }, [posts]);

  useEffect(() => {
    getBlogPost();
  }, [getBlogPost, n]);

  return (
    <div>
      {!!posts && n >= 0 && (
        <Spreadsheet
          readOnly={true}
          data={displayBlogPost()}
          onBlur={getBlogPost}
          columnLabels={[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Total",
          ]}
          rowLabels={[arrayF + "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" + name]}
        />
      )}
    </div>
  );
};

export default Spreadsheets;
