import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";

function Dashboard(props) {
  const studentUserId = 1;
  const taUserId = 2;
  const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState([]);
  const [taToDos, setTaToDos] = useState([]);

  useEffect(() => {
    if (props.ISstudent) {
      (async () => {
        const res = await fetch("/api/announcements?courseId=1");
        const resData = await res.json();
        setAnnouncements(
          resData.data.map(el => ({
            name: el.announcement,
            info: "",
            data: el,
          })),
        );
        console.log(resData.data);
      })();
    }

    (async () => {
      let res, resData;
      const today = new Date().toISOString().split("T")[0];
      res = await fetch(
        `/api/assignments?courseId=1&minReviewDueDate=${today}`,
      );
      resData = await res.json();
      const assignments = resData.data;

      let statusUpdates = [];
      if (!props.ISstudent) {
        statusUpdates = assignments.map(assignment => ({
          name: "Status " + assignment.reviewStatus,
          info: assignment.name,
          data: assignment,
        }));
      }

      const toDoReviews = [];
      for (const { id, name, reviewDueDate } of assignments) {
        res = await fetch(
          `/api/peerReviews?userId=${
            props.ISstudent ? studentUserId : taUserId
          }&assignmentId=${id}`,
        );
        resData = await res.json();
        const peerMatchings = resData.data;

        if (props.ISstudent) {
          toDoReviews.push({ name, info: reviewDueDate, data: peerMatchings });
        } else {
          for (const peerMatching of peerMatchings) {
            toDoReviews.push({
              name: "Grade Submission " + peerMatching.submissionId,
              info: name,
              data: peerMatching,
            });
          }
        }
      }

      props.ISstudent
        ? setToDoReviews(toDoReviews)
        : setTaToDos([...toDoReviews, ...statusUpdates]);
    })();
  }, [props.ISstudent]);

  if (props.ISstudent) {
    return (
      <div className="Content">
        <ListContainer
          name="Todos"
          data={toDoReviews}
          student={props.ISstudent}
          link="/peer_reviews/peerreview"
        />
        <ListContainer
          name="Announcements"
          data={announcements}
          student={props.ISstudent}
          link=""
        />
      </div>
    );
  } else {
    return (
      <div className="Content">
        <ListContainer
          name="Todos"
          data={taToDos}
          student={props.ISstudent}
          link=""
        />{" "}
        {/*link depends on the todo*/}
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        />
        {/*link needs to be figured out later, might always be blank*/}
      </div>
    );
  }
}

export default Dashboard;
