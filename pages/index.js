import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import Cookies from 'js-cookie';
import { useUserData } from "../components/storeAPI";
import ViewAsStudent from "../components/viewAsStudent";
import StudentViewOutline from '../components/studentViewOutline';
const axios = require("axios");
import _ from "lodash";

function Dashboard(props) {
  const [canvasAssignments, setCanvasAssignments] = useState();
  // const [announcements, setAnnouncements] = useState([]);
  const [toDoReviews, setToDoReviews] = useState();
  const [taToDos, setTaToDos] = useState([]);
  // const [studentCompletedReviews, setStudentCompletedReviews] = useState([]);
  const [studentInProgressReviews, setStudentInProgressReviews] = useState([]);
  const [userCreated, setUserCreated] = useState(false);
  const { createUser, userId, courseId, roles, courseName, savedStudentId } = useUserData();
  useEffect(() => {
    if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
      console.log('creating user data');
      const userData = JSON.parse(Cookies.get('userData'));
      console.log({userData});
      createUser(userData);
      setUserCreated(!userCreated);
    }
  }, []);

  const isInstructor = props.ISstudent !== undefined && !props.ISstudent;

  // check enrollments (if instructor)
  useEffect(() => {
    if (courseId && isInstructor && courseName) {
      console.log(`checking enrollments in ${courseId}`);

      // launch async function to check enrollment.
      (async () => {
        try {

          const courseData = (await axios.get(`/api/courses?canvasId=${courseId}`))
            .data.data;

          if (!courseData.length) {
          // create course, error if course exists.
            try {
              await axios.post(`/api/courses`,{
                active: true,
                canvasId: courseId,
                id: courseId,             // this needs to be fixed.
                courseName: `Course ${courseId}`,     // this is not courseName
                canvasKey: null           // not sure what this is
              });

              console.log(`created course ${courseId} [${courseName}]`);
            } catch (err) {
              console.log({err});
              console.log(`failed to create course ${courseId} [${courseName}]`);
            }
          }

          const [canvasUsers,dbUsers,dbEnrollments] = (await Promise.all([
            axios.get(`/api/canvas/users?courseId=${courseId}`),
          //  axios.get(`/api/users`),
            axios.get(`/api/users?courseId=${courseId}`),
            axios.get(`/api/courseEnrollments?courseId=${courseId}`)
          ]))
            .map(({data}) => data.data);

          // find users that need to be added to db
          const dbUserLookup = _.keyBy(dbUsers,({canvasId}) => canvasId);
          const newUsers = canvasUsers
            .filter(({canvasId}) => !dbUserLookup[canvasId]);

          // find new enrollments that need to be added to db.
          const dbEnrollmentLookup = _.keyBy(dbEnrollments,({userId,enrollment}) => [userId,enrollment]);
          const newEnrollments = canvasUsers
            .filter(({canvasId,enrollment}) => !dbEnrollmentLookup[[canvasId,enrollment]]);

          if (newEnrollments.length) {
            const newEnrollmentsPayload = newEnrollments
              .map(({canvasId,enrollment}) => ({
                userId: canvasId,
                courseId,
                enrollment
              }));

            const newUsersPayload = newEnrollments
              .map(u => ({
                ...u,
                id:u.canvasId  // THIS SHOULD NOT BE DONE, BUT CURRENT CODE MAY REQUIRE IT!
              }));

            console.log(`adding ${newUsersPayload.length} new users`);
            console.log(`adding ${newEnrollmentsPayload.length} new enrollments`);


            // add new users
            const newUsersResult = (await axios.post("/api/users?type=multiple&filter=true",newUsersPayload))
              .data;

            // add new enrollments
            const newEnrollmentsResult = (await axios.post("/api/courseEnrollments?type=multiple&filter=true",newEnrollmentsPayload))
              .data;

            console.log(`added ${newUsersResult.length} new users`);
            console.log(`added ${newEnrollmentsResult.length} new enrollments`);
          }


        } catch (err){
          console.log("errors getting canvasUsers, dbUsers, or dbCourseEnrollments");
          console.log(err);
        }
      })();


    } else {
      console.log("skipping enrollment check (data not ready)");
    }

  },[courseId, courseName, isInstructor]);

  useEffect(() => {
    (async () => {
      if (props.ISstudent) {
        console.log('this is a student')
      } else {
        console.log('this is an instructor / TA')
      }
      if (!courseId) {
        console.log("useEffect found no courseId");
      } else { // don't load anything until userData is available
        console.log(`useEffect found courseId ${courseId}`);
        axios.get(`/api/canvas/assignments?type=multiple&courseId=${courseId}`).then(response => {
          setCanvasAssignments(response.data.data);
          console.log({response});
        });
        let res, resData;
        // let today = new Date();
        // today.setHours(today.getHours() - 1); // add 1 hour offset
        res = await axios.get(`/api/assignments?courseId=${courseId}`);

        resData = res.data;
        const assignments = resData.data;

      const toDoReviews = [];
      const taToDoReviews = [];
      // const studentCompletedReviews = [];
      const tempStudentInProgressReviews = [];
      for (const { id, name, assignmentDueDate, reviewDueDate, rubricId, reviewStatus } of assignments) { // push OG assignments
        let actionItem = ''
        let taActionItem = ''
        let studentActionItem = ''

        switch(reviewStatus) {
          case 1:
            actionItem = 'Waiting for assignment due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No peer reviews to complete yet'
            break;
          case 2:
            actionItem = 'Run Peer Matching'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No peer reviews to complete yet'
            break;
          case 3:
            actionItem = 'Waiting for review due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'Complete your peer reviews'
            break;
          case 4:
            actionItem = 'Run Additional matches algorithm'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No tasks'
            break;
          case 5:
            actionItem = 'Complete TA grading'
            taActionItem = 'Complete TA grading, confirm when done'
            studentActionItem = 'No tasks'
            break;
          case 6:
            actionItem = 'Run the Reports algorithm'
            taActionItem = 'No tasks yet'
            studentActionItem = 'No tasks'
            break;
          case 7:
            actionItem = 'Set appeals due date'
            taActionItem = 'No tasks yet'
            studentActionItem = 'Grades available in Peerpal'
            break;
          case 8:
            actionItem = 'Check for appeals'
            taActionItem = 'Complete appeals, confirm when complete'
            studentActionItem = 'Check grades and submit appeals if necessary'
            break;
          case 9:
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
          taToDoReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, actionItem: taActionItem, reviewStatus, link:"/assignments/fullassignmentview/fullassignmentview"})

          tempStudentInProgressReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, reviewStatus, actionItem:studentActionItem, link:"/assignments/fullassignmentview/fullassignmentview"});
          //studentInProgressReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate)
          //setStudentInProgressReviews(studentInProgressReviews)
          //ID where duedate and linked are defined
        }
        // else {
        //   studentCompletedReviews.push({ canvasId: id, name, assignmentDueDate: assignmentDueDate, reviewDueDate:reviewDueDate, rubricId: rubricId, reviewStatus, actionItem:studentActionItem, link:"/assignments/fullassignmentview/fullassignmentview"});
        //   //studentCompletedReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate)
        //   //setStudentCompletedReviews(studentCompletedReviews)
        // }
      }

      const studentToDoReviews = tempStudentInProgressReviews.filter(({reviewStatus}) => reviewStatus < 4);

      // const studentDoneReviews = toDoReviews.filter(function(e){
      //   return e.reviewStatus >= 4
      // })
      console.log('ta todos:',taToDoReviews)
      console.log('studentToDoReviews',studentToDoReviews);
      console.log('tempStudentInProgressReviews',tempStudentInProgressReviews);
      //taToDoReviews.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
      setToDoReviews(taToDoReviews);
      setTaToDos(toDoReviews);
      setStudentInProgressReviews(studentToDoReviews);
      // setStudentCompletedReviews(studentCompletedReviews);
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
    data= {[{name:"Enable your first assignment for Peer Reviews under Canvas Assignments!"}]}
    info= "Get Started"
    link= "/"
  />
  }
}
function StudentToDoList(props) {
  console.log('props:',props);
  if (props.toDoReviews) {
    return <ListContainer
    name="Peer Review Assignments"
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
