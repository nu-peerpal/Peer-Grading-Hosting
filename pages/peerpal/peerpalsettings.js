import React, { useState, useEffect } from "react";
import styles from './peerpalsettings.module.scss';
import Cookies from 'js-cookie';
import Container from "../../components/container";
import SubmitButton from '../../components/submitButton';
import TextField from '@material-ui/core/TextField';
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
const axios = require("axios");

function PeerpalSettings(props) {
  const { userId, courseId, courseName, assignment, createUser, savedStudentId } = useUserData();
  const [userCreated, setUserCreated] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitResponse, setSubmitResponse] = useState("");
  const [responseView, setResponseView] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentInput, setAssignmentInput] = useState();
  useEffect(() => {
    if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
      console.log('creating user data');
      const userData = JSON.parse(Cookies.get('userData'));
      console.log({userData});
      createUser(userData);
      setUserCreated(!userCreated);
    }
  }, []);

  function findSubmissionCanvasIds(tempUsers, tempSubmissionData) {
    // tempSubmissionData is canvas subs api, tempUsers is canvas users api
    // organize submissions by group
    let subGroups = {};
    let bucket;
    tempSubmissionData.forEach(submission => { // sort submissions by {groupId: [...userIds]}
      if (!submission.groupId) {
        bucket = submission.submitterId;
      } else {
        bucket = submission.groupId;
      }
      if (subGroups[bucket]) {
        subGroups[bucket].push(submission.submitterId);
        subGroups[bucket].sort(function(a, b){return a-b})
      } else {
        subGroups[bucket] = [submission.submitterId];
      }
    });
    let tempGroup, tempSub, tempAid;
    for (let sub in tempSubmissionData) { // grab group, find lowest group member, get aid
      if (!tempSubmissionData[sub]["groupId"]) {
        tempGroup = tempSubmissionData[sub].submitterId;
      } else {
        tempGroup = tempSubmissionData[sub]["groupId"];
      }
      tempSub = tempSubmissionData.filter(sub => sub.submitterId == subGroups[tempGroup][0]);
      tempAid = tempSub[0].canvasId;
      tempSubmissionData[sub]["canvasId"] = tempAid;
    }
    // console.log({tempSubmissionData});
    let subStudents = {};
    let tempSubmissions = []; // set submissions for peerMatch alg
    for (let sub in tempSubmissionData) {
      let student = tempUsers.filter(user => user.canvasId == tempSubmissionData[sub]["submitterId"]);
      let subId = tempSubmissionData[sub]["canvasId"];
      student = student[0]["firstName"] + " " + student[0]["lastName"];
      bucket = tempSubmissionData[sub]["canvasId"];
      if (subStudents[bucket]) {
        subStudents[bucket].push(student);
      } else {
        subStudents[bucket] = [student];
      }
      tempSubmissions.push([tempSubmissionData[sub]["submitterId"],subId]);
    }
    return tempSubmissions;
  }

  async function matchUsersToCanvasSubmissions(course, assignment) {
    let data = await Promise.all([axios.get(`/api/users?courseId=${course}&enrollment=StudentEnrollment`),
          axios.get(`/api/canvas/submissions?courseId=${course}&assignmentId=${assignment}`),
          axios.get(`/api/submissions?assignmentId=${assignment}`)]);
    let users = data[0].data;
    console.log({users})
    let canvasSubs = data[1].data.data;
    let dbSubs = data[2].data.data;
    console.log({dbSubs})
    let userSubMap = {};
    let unmatched = [];

    //// Map users to canvas sub id
    let userSubsList = findSubmissionCanvasIds(users, canvasSubs)
    console.log({userSubsList});

    //// format group enrollments
    let enrollments = [];
    userSubsList.forEach(match => {
      let userId = match[0];
      let canvasSubId = match[1];
      let findDb = dbSubs.filter(sub => sub.canvasId == canvasSubId);
      if (findDb.length == 0) unmatched.push(canvasSubId);
      if (findDb.length > 1) alert('multiple db subs for one canvas sub')
      let dbId = findDb[0];
      enrollments.push({
        assignmentId: parseInt(assignmentInput),
        userId: userId,
        submissionId: dbId
      })
    })
    console.log({enrollments});


    // users.forEach(user => {
    //   let matches = canvasSubs.filter(sub => sub.submitterId == user.id);
    //   if (matches.length > 1) alert(`user ${user.id} submitted ${String(matches)}`); // user connected to more than one submission
    //   if (matches.length == 0) { // user did not submit anything
    //     unmatched.push(user.id);
    //     userSubMap[user.id] = null;
    //   } else {
    //     let sub = matches[0];
    //     if (userSubMap[user.id]) {
    //       alert('Reached duplicate user ?') // Multiple submissions from the same user should never happen
    //     } else {
    //       userSubMap[user.id] = sub.canvasId;
    //     }
    //   }
    // })
    // ///// group_enrollments format
    // let enrollments = [];
    // users.forEach(user => {
    //   let enrollment = {
    //     assignmentId: parseInt(assignmentInput),
    //     userId: user.id,
    //     submissionId: userSubMap[user.id]
    //   }
    //   enrollments.push(enrollment);
    // })


    // console.log({enrollments});
    //// post to db
    // let res = await axios.post(`/api/groupEnrollments?type=multiple`,enrollments);
    // console.log({res});
    setResponseView(String(unmatched))
    return enrollments;
  }

  useEffect(() => {
    if (userCreated) {
      axios.get(`/api/assignments?courseId=137500`).then(res => {
        let courseAssignments = res.data.data;
        let assigns = courseAssignments.map(assignment => {
          return assignment.id;
        })
        setAssignments(assigns);
      })
    }
  }, [userCreated])

  async function handleSubmit() {
    let map = await matchUsersToCanvasSubmissions(137500,assignmentInput);
    console.log({map});
    // assignments.forEach(async assignment => {
    //   let res = await matchUsersToCanvasSubmissions(137500,assignment);
    //   console.log({res});
    // })
    setSubmitSuccess(true);
    setSubmitResponse("Success")
  }

  return (
    <div className="Content">
      <Container name={"PeerPal Developer Dashboard"}>
        <div className={styles.resView}>
          Unmatched users: {responseView}
        </div>
        <div className={styles.details}>
          <form noValidate>
              <TextField className={styles.submitButton}
                name="assignmentId"
                label="Assignment Id"
                onChange={e => setAssignmentInput(e.target.value)}
              />
          </form>
          <SubmitButton onClick={handleSubmit} title={"Submit"}
            submitAlert={submitResponse}
            submitSuccess={submitSuccess}/>
        </div>

      </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default PeerpalSettings;
