import React, { useState, useEffect } from "react";
import Router from 'next/router'
import ListContainer from "../components/listcontainer";
const canvasCalls = require("../canvasCalls");

function ToDoList(props) {
  if (props.data) {
    return <ListContainer
      name="Todos"
      data={props.data}
      student={props.ISstudent}
      link={props.link}
    />
  } else { // No items in to do list. 
  return <ListContainer
    name="Todos"
    data= {[{name:"Enable your first assignment for Peer Reviews!"}]}
    info= "Get Started"
    link= "/canvas/canvas"
  />
  }
}

function Dashboard(props) {
  const studentUserId = 1;
  const taUserId = 2;
  const [assignments, setAssignments] = useState('');
  const [canvasAssignments, setCanvasAssignments] = useState();
  const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState([]);
  const [taToDos, setTaToDos] = useState([]);

  useEffect(() => {
    if (props.ISstudent) {
      console.log('this is a student')
    }  
    canvasCalls.getAssignments(canvasCalls.token, 1).then(response => {
      setCanvasAssignments(response);
      console.log(response);
    });
    // else { // look for existing users
    //   (async () => {
    //     const res = await fetch(`/api/users?courseId=1&enrollment=student`)
    //     const resData = await res.json();
    //     console.log('TA DATA:',resData.data);
    //     if (!resData.data.includes(taUserId)) {
    //       console.log('TA not found. Redirecting to setup...')
    //       const {pathname} = Router
    //       if(pathname == '/' ){
    //         Router.push('/canvas/canvas')
    //       }
    //     }
    //   })();
    // }
  
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

      // if (toDoReviews.length==0) {
      //   console.log('made it')
      //   toDoReviews.push({
      //     name: "Enable your first class for Peer Reviews!",
      //     info: "Get Started",
      //     link: "/canvas/canvas"
      //   });
      // }

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
  } else { // TA or Instructor View
    return (
      <div className="Content">
        <ToDoList />
        
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        />
        {/*link needs to be figured out later, might always be blank*/}
        <ListContainer
          name="Canvas Assignments"
          data={canvasAssignments}
          link="/assignments/fullassignmentview/fullassignmentview"
        />
      </div>
    );
  }
}

export default Dashboard;
