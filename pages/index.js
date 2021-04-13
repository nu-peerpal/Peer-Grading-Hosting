import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import Cookies from 'js-cookie';
import { useUserData } from "../components/storeAPI";
import ViewAsStudent from "../components/viewAsStudent";
import StudentViewOutline from '../components/studentViewOutline';
const axios = require("axios");

function Dashboard(props) {
  const studentUserId = 1;
  const taUserId = 2;
  const [canvasAssignments, setCanvasAssignments] = useState();
  // const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState([]);
  const [taToDos, setTaToDos] = useState([]);
  const { createUser, userId, courseId, courseName, assignment, roles, savedStudentId } = useUserData();

  useEffect(() => {
    if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
      console.log('creating user data');
      const userData = JSON.parse(Cookies.get('userData'));
      // console.log('user data: ', userData);
      createUser(userData);
    }
  }, []);

  useEffect(() => {
    if (props.ISstudent) {
      console.log('this is a student')
    }
    axios.get(`/api/canvas/assignments?type=multiple&courseId=${courseId}`).then(response => {
      setCanvasAssignments(response.data.data);
    });

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
          name: "Status: " + assignment.reviewStatus,
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
        console.log('peer matchings:',peerMatchings);

        if (props.ISstudent) {
          toDoReviews.push({ name, dueDate: reviewDueDate, data: peerMatchings });
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
        {/* <ListContainer
          name="Announcements"
          data={announcements}
          student={props.ISstudent}
          link=""
        /> */}
        <StudentViewOutline SetIsStudent={props.SetIsStudent} />
      </div>
    );
  } else { // TA or Instructor View
    return (
      <div className="Content">
        <ToDoList data={taToDos}/>
        
        {/* <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        /> */}
        <ViewAsStudent SetIsStudent={props.SetIsStudent} />

        {/*link needs to be figured out later, might always be blank*/}
        <CanvasAssignments assignments={canvasAssignments} />
        {/* <ListContainer
          name="Canvas Assignments"
          data={canvasAssignments}
          link="/assignments/fullassignmentview/fullassignmentview"
        /> */}
        <StudentViewOutline SetIsStudent={props.SetIsStudent} />
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
    link= "/canvas/canvasSelect"
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
