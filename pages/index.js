import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";

function Dashboard(props) {
  const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState([
    {
      name: "Assignment 1",
      info: "2020-11-30", // review due date
      data: {
        matchingType: "initial",
        review: "",
        reviewReview: "",
        assignmentId: 1,
        submissionId: 1,
        userId: 1,
      },
    },
  ]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/announcements?courseId=1");
      const resData = await res.json();
      setAnnouncements(
        resData.data.map((el) => ({
          name: el.announcement,
          info: "",
          data: el,
        })),
      );
      console.log(resData.data);
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const today = new Date().toISOString().split("T")[0];
  //     const res = await fetch(
  //       `/api/assignments?courseId=1&minReviewDueDate=${today}`,
  //     );
  //     const resData = await res.json();
  //     console.log(resData);
  //   })();
  // }, []);

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
      {/*link depends on the announcement*/}
    </div>
  );
  // } else if (props.ISstudent == false) {
  //   var ToDos = [];
  //   const { data: todos } = useSWR(
  //     "/api/ta/to-dos?courseId=1&userId=1",
  //     fetcher,
  //   );
  //   if (todos) {
  //     todos.Peer_Review_ToDo.map((x) =>
  //       ToDos.push({
  //         name: "Grade Submission " + x.id,
  //         info: x.assignment.name,
  //         data: x,
  //       }),
  //     );
  //     todos.Status_Updates.map((x) =>
  //       ToDos.push({
  //         name: "Status " + x.peer_review_statuses[0].status,
  //         info: x.name,
  //         data: x,
  //       }),
  //     );
  //   }
  //   return (
  //     <div className="Content">
  //       <ListContainer
  //         name="Todos"
  //         data={ToDos}
  //         student={props.ISstudent}
  //         link=""
  //       />{" "}
  //       {/*link depends on the todo*/}
  //       <ListContainer
  //         name="View As Student"
  //         data={[{ name: "View As", info: "VIEW" }]}
  //         link=""
  //       />
  //       {/*link needs to be figured out later, might always be blank*/}
  //     </div>
  //   );
  // }
}

export default Dashboard;
