import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import Cookies from 'js-cookie';
import { useUserData } from "../components/storeAPI";
const axios = require("axios");
const canvasCalls = require("../canvasCalls");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('fake_secret');

function Dashboard(props) {
  const studentUserId = 1;
  const taUserId = 2;
  const [assignments, setAssignments] = useState('');
  const [canvasAssignments, setCanvasAssignments] = useState();
  const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState([]);
  const [taToDos, setTaToDos] = useState([]);
  const { createUser, setKey, userId, courseId, courseName, assignment, roles, key } = useUserData();
  let todos = true;

  useEffect(() => {
    if (Cookies.get('userData')) {
      const userData = JSON.parse(Cookies.get('userData'));
      console.log('user data: ', userData);
      createUser(userData);
      // console.log('userId: ', userId, 'courseId: ', courseId, 'assignment: ',assignment);
    }
    // axios.get(`/api/courses?canvasId=${courseId}`).then(res => {
    //   if (res) {
    //     let resKey = res.data.data[0].canvasKey;
    //     (async () => {
    //       let dekey = await cryptr.decrypt(resKey);
    //       setKey(dekey);
    //     })();
    //   } else {
        
    //   }
    // });

    if (props.ISstudent) {
      console.log('this is a student')
    }  
    canvasCalls.getAssignments(canvasCalls.token, courseId).then(response => {
      setCanvasAssignments(response);
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
        <ToDoList data={taToDos}/>
        
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        />
        {/*link needs to be figured out later, might always be blank*/}
        <CanvasAssignments assignments={canvasAssignments} />
        {/* <ListContainer
          name="Canvas Assignments"
          data={canvasAssignments}
          link="/assignments/fullassignmentview/fullassignmentview"
        /> */}
      </div>
    );
  }
}

function ToDoList(props) {
  if (props.data[0]) {
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
function CanvasAssignments(props) {
  if (props.assignments) {
    return <ListContainer
      name="Canvas Assignments"
      data={props.assignments}
      link="/assignments/fullassignmentview/fullassignmentview"
    />
  } else { // No assignments loaded 
  return null;
  }
}

export default Dashboard;
