import React, { useState, useEffect, useCallback, useRef } from "react";
import Spreadsheet from "react-spreadsheet";
import axios from "axios";
import { saveSpreadsheet } from "../../services/spreadsheetService";

const Spreadsheets = (props) => {
  let n = props.n;
  let user = props.user;
  let array = props.array;
  let duration = props.duration;

  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState();
  const [selected, setSelected] = useState(null);

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
    // Getting the spreadsheet data from our database unless this is the first time loading the page after having been assigned a new project,
    !!info &&
      axios
        .get("http://localhost:3900/api/spreadsheets")
        .then((response) => {
          const data = response.data;
          const data_per_user = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].email === user.email && data[i].project === array) {
              data_per_user.push(data[i]);
            }
          }

          if (data_per_user.length >= 7 * duration) {
            setPosts(data_per_user);
          }
          // in which case creating 0-s for the entire time range.
          else {
            for (let i = 0; i < 7 * duration; i++) {
              saveSpreadsheet({
                value: 0,
                email: user.email,
                project: array,
              });
            }

            window.location.reload();
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

  const handleUpdate = useCallback(
    (el, row, column) => {
      const number = posts[7 * n + column + 7 * row]._id;
      const numbers = {
        _id: number,
        value: !!el ? el : 0,
        email: user.email,
        project: array,
      };
      saveSpreadsheet(numbers);
    },
    [posts]
  );

  //A new value gets submitted after pressing "Enter" or "Tab" key.
  const handleKeyPress = (e) => {
    if (e.keyCode === 9 || (e.keyCode === 13 && !e.shiftKey)) {
      getBlogPost();
    }
  };

  return (
    <div>
      {!!posts && (
        <Spreadsheet
          onSelect={(o) => {
            if (Array.isArray(o) && o.length === 0) {
              setSelected(null);
              return;
            }
            if (!o) return;
            if (!selected) {
              setSelected(o[0]);
            } else if (
              selected.row !== o[0].row ||
              selected.column !== o[0].column
            ) {
              setSelected(o[0]);
            }
          }}
          data={displayBlogPost()}
          onChange={(arr) => [
            selected !== null &&
              handleUpdate(
                arr[selected.row][selected.column]?.value,
                selected.row,
                selected.column
              ),
          ]}
          onBlur={getBlogPost}
          onKeyDown={(e) => handleKeyPress(e)}
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
          rowLabels={[array]}
        />
      )}
    </div>
  );
};

export default Spreadsheets;
