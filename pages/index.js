import React, { useState, useEffect } from "react";
import {getSteps} from '../components/assignmentchecklist';
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
  const [studentCompletedReviews, setStudentCompletedReviews] = useState([]);
  const [studentInProgressReviews, setStudentInProgressReviews] = useState([]);
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
      if (courseId!="") { // don't load anything until userData is available
        axios.get(`/api/canvas/assignments?type=multiple&courseId=${courseId}`).then(response => {
          setCanvasAssignments(response.data.data);
          console.log({response});
        });
        let res, resData;
        // let today = new Date();
        // today.setHours(today.getHours() - 1); // add 1 hour offset
        res = await axios.get(`/api/assignments?courseId=${courseId}&`);
        
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
      const taToDoReviews = [];
      const studentCompletedReviews = [];
      const studentInProgressReviews = [];
      //reviews completed and reviews in progress 
     // reviews statuses past 2 and before 2. 2 = completed
      // extract review status from each assignment
      console.log(assignments)
      for (const { id, name, assignmentDueDate, reviewDueDate, rubricId, reviewStatus, createdAt } of assignments) { // push OG assignments
        let actionItem = ''
        let taActionItem = ''
        let studentActionItem = ''

        switch(reviewStatus) {
          case 0:
            actionItem = 'Waiting for assignment due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No peer reviews to complete yet'
            break;
          case 1:
            actionItem = 'Run Peer Matching'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No peer reviews to complete yet'
            break;
          case 2:
            actionItem = 'Waiting for review due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'Complete your peer reviews'
            break;
          case 3:
            actionItem = 'Run Additional matches algorithm'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No tasks'
            break;
          case 4:
            actionItem = 'Complete TA grading'
            taActionItem = 'Complete TA grading, confirm when done'
            studentActionItem = 'No tasks'
            break;
          case 5:
            actionItem = 'Run the Reports algorithm'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No tasks'
            break;
          case 6:
            actionItem = 'Set appeals due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'Grades available in Peerpal'
            break;
          case 7:
            actionItem = 'Check for appeals'
            taActionItem = 'Complete appeals, confirm when complete'
            studentActionItem = 'Check grades and submit appeals if necessary'
            break;
          case 8:
            actionItem = 'Appeals complete. Send grades to Canvas.'
            taActionItem = 'No tasks yet'
            studentActionItem = 'Appeals under review'
            break;
          default:
            actionItem = 'Assignment Completed'
            taActionItem = 'Complete' 
            studentActionItem = 'Grades submitted to Canvas' 
        }


        // based on where you are in action item list show the next action item
        if (reviewStatus < 9) {
          toDoReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, actionItem: actionItem, reviewStatus:reviewStatus, link:"/assignments/fullassignmentview/fullassignmentview"});
          //toDoReviews = toDoReviews.assignmentDueDate.sort((a,b) => {
          //  return new Date(a).getTime() - 
          //      new Date(b).getTime()
        //}).reverse();
          //toDoReviews.sort((a,b) => b.reviewDueDate - a.reviewDueDate).reverse()
          //setToDoReviews(toDoReviews)
          console.log(toDoReviews)
          console.log(props)
          taToDoReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, actionItem: taActionItem, reviewStatus, link:"/assignments/fullassignmentview/fullassignmentview"})
          
          studentInProgressReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, reviewStatus, actionItem:studentActionItem, link:"/assignments/fullassignmentview/fullassignmentview"});
          //studentInProgressReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate)
          //setStudentInProgressReviews(studentInProgressReviews)
          console.log('in progress:',studentInProgressReviews)
          //ID where duedate and linked are defined
        }
        else {
          studentCompletedReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, reviewStatus, actionItem:studentActionItem, link:"/assignments/fullassignmentview/fullassignmentview"});
          //studentCompletedReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate)
          //setStudentCompletedReviews(studentCompletedReviews)
        }
      }

      const studentToDoReviews = toDoReviews.filter(function(e){
        return e.reviewStatus < 2
      })
      const studentDoneReviews = toDoReviews.filter(function(e){
        return e.reviewStatus >= 2
      })
      console.log('ta todos:',taToDoReviews)
      //taToDoReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
      setToDoReviews(taToDoReviews);
      setTaToDos(toDoReviews);
      setStudentInProgressReviews(studentInProgressReviews);
      setStudentCompletedReviews(studentCompletedReviews);
    }
    })().catch( e => { console.error(e) });
  }, [props.ISstudent, savedStudentId, userCreated]);

  if (props.ISstudent) {
    return (
      <div className="Content">
        <StudentToDoList 
          toDoReviews={studentInProgressReviews}
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
    console.log(props)
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
  console.log(props)
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
