import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import Cookies from 'js-cookie';
import { useUserData } from "../components/storeAPI";
import ViewAsStudent from "../components/viewAsStudent";
import StudentViewOutline from '../components/studentViewOutline';
const axios = require("axios");

function Dashboard(props) {
  const [canvasAssignments, setCanvasAssignments] = useState();
  // const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState();
  const [taToDos, setTaToDos] = useState([]);
  const [userCreated, setUserCreated] = useState(false);
  const { createUser, userId, courseId, courseName, assignment, roles, savedStudentId } = useUserData();
  useEffect(() => {
    if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
      console.log('creating user data');
      const userData = JSON.parse(Cookies.get('userData'));
      console.log({userData});
      // console.log('user data: ', userData);
      createUser(userData);
      setUserCreated(!userCreated);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (props.ISstudent) {
        console.log('this is a student')
      }
      axios.get(`/api/canvas/assignments?type=multiple&courseId=${courseId}`).then(response => {
        setCanvasAssignments(response.data.data);
        console.log({response});
      });
      let res, resData;
      const today = new Date().toISOString().split("T")[0];
      if (props.ISstudent) {
        res = await axios.get(`/api/assignments?courseId=${courseId}&minReviewDueDate=${today}`);
      } else {
        res = await axios.get(`/api/assignments?courseId=${courseId}`);
      }
      resData = res.data;
      // console.log({resData});
      const assignments = resData.data;
      let statusUpdates = [];
      // if (!props.ISstudent) {
      //   statusUpdates = assignments.map(assignment => ({
      //     name: "Status: " + assignment.reviewStatus,
      //     info: assignment.name,
      //     data: assignment,
      //   }));
      // }

      const toDoReviews = [];
      for (const { id, name, reviewDueDate, rubricId } of assignments) { // push OG assignments
        toDoReviews.push({ canvasId: id, name, assignmentDueDate: reviewDueDate, rubricId: rubricId, link:"/assignments/fullassignmentview/fullassignmentview"});
      }

      setToDoReviews(toDoReviews);
      setTaToDos([...toDoReviews, ...statusUpdates]);
    })().catch( e => { console.error(e) });
  }, [props.ISstudent, savedStudentId]);

  if (props.ISstudent) {
    return (
      <div className="Content">
        <StudentToDoList 
          toDoReviews={toDoReviews}
          ISstudent={props.ISstudent}
          />
        {/* <ListContainer
          name="Todos"
          data={toDoReviews}
          student={props.ISstudent}
          link="/peer_reviews/peerreview"
        /> */}
        {/* <ListContainer
          name="Announcements"
          data={announcements}
          student={props.ISstudent}
          link=""
        /> */}
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
      </div>
    );
  } else { // TA or Instructor View
    return (
      <div className="Content">
        <ToDoList data={taToDos}/>
        {roles.includes('ta') && <TaToDoList toDoReviews={toDoReviews} ISstudent={props.ISstudent} /> }
        {/* <TaToDoList toDoReviews={toDoReviews} ISstudent={props.ISstudent} /> */}
        <ViewAsStudent SetIsStudent={props.SetIsStudent} />
        <CanvasAssignments assignments={canvasAssignments} />
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
      </div>
    );
  }
}

function ToDoList(props) {
  if (props.data[0]) {
    return <ListContainer
      name="Peer Review Enabled Assignments"
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
function StudentToDoList(props) {
  if (props.toDoReviews) {
    return <ListContainer
    name="Assignments to Review"
    data={props.toDoReviews}
    student={props.ISstudent}
    link="/peer_reviews/selectReview"
  />
  } else {
    return null;
  }
}
function TaToDoList(props) {
  if (props.toDoReviews) {
    return <ListContainer
    name="Assignments to Review as TA"
    data={props.toDoReviews}
    link="/grading/selectTaGrading"
  />
  } else {
    return null;
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
