import React, { useState, useEffect } from "react";
import styles from "../pages/assignments/matching/matching.module.scss";
import TextField from "@material-ui/core/TextField";
import { Field, Formik, Form } from "formik";
import Button from "@material-ui/core/Button";
import MatchingCell from "./matchingCell";
import AutoComplete from "./autocomplete";
import { peerMatch } from "../pages/api/AlgCalls.js";
import { useUserData } from "./storeAPI";
import { useRouter } from 'next/router';
const axios = require("axios");

function Settings({ setSubmitted, setSubmissionData, setSubStudentIds, setGrader, setMatchings, setMatchingGrid, setUserList, ISstudent, SetIsStudent }) {
    const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
    const [tas, setTas] = useState([]);
    const [matchedUsers, setMatchedUsers] = useState();
    const [matchedSubs, setMatchedSubs] = useState();
    const [submissionGroups, setSubmissionGroups] = useState();
    const [users, setUsers] = useState();
    const [graders, setGraders] = useState([]);
    const [peers, setPeers] = useState([]);
    const [submissions,setSubmissions] = useState([]);
    const router = useRouter()
    const { userId, courseId, courseName, assignment } = useUserData();

    useEffect(() => {
      // get and parse canvas data (users, submissionos, groups)to run peerMatch algorithm
      Promise.all([axios.get(`/api/canvas/users?courseId=${courseId}`),axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${router.query.assignmentId}`)]).then((canvasData) => {
        console.log('canvas data:',canvasData);
        let tempUsers = canvasData[0].data.data;
        let tempSubmissionData = canvasData[1].data.data;
        setSubmissionData(tempSubmissionData); //used for pushing submissions later
        // separate users, compile data for alg call
        let graderData = tempUsers.filter(user => user.enrollment == "TaEnrollment" || user.enrollment == "TeacherEnrollment");
        let tempGraders = [];
        let tempTas = [];
        for (let grader in graderData) {
          tempTas.push(graderData[grader]["firstName"] + " " + graderData[grader]["lastName"]);
          tempGraders.push({
            name: graderData[grader]["firstName"] + " " + graderData[grader]["lastName"],
            id: graderData[grader]["canvasId"]
          });
        }
        let peerData = tempUsers.filter(user => user.enrollment == "StudentEnrollment");
        let tempPeers = [];
        for (let peer in peerData) {
          tempPeers.push(peerData[peer]["canvasId"]);
        }
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
        let subStudentId = {};
        let tempSubmissions = []; // set submissions for peerMatch alg
        for (let sub in tempSubmissionData) {
          let student = tempUsers.filter(user => user.canvasId == tempSubmissionData[sub]["submitterId"]);
          let subId = tempSubmissionData[sub]["canvasId"];
          let studentName = student[0]["firstName"] + " " + student[0]["lastName"];
          bucket = tempSubmissionData[sub]["canvasId"];
          if (subStudents[bucket]) {
            subStudents[bucket].push(studentName);
            subStudentId[bucket].push(student[0].canvasId);
          } else {
            subStudents[bucket] = [studentName];
            subStudentId[bucket] = [student[0].canvasId];
          }
          tempSubmissions.push([tempSubmissionData[sub]["submitterId"],subId]);
        }
        // console.log({subStudents})
        setSubStudentIds(subStudentId)
        setSubmissionGroups(subStudents);
        // console.log('alg data: ',tempUsers,tempGraders,tempPeers,tempSubmissions)
        setTas([tempTas]);
        setUsers(tempUsers);
        setUserList(tempUsers);
        setGraders(tempGraders);
        setPeers(tempPeers.sort(function(a, b){return a-b}));// sort by increasing user id
        setSubmissions(tempSubmissions);

      });
    },[]);

      useEffect(() => {
        console.log('View toggled!');
        if (matchedUsers && matchedSubs) {
          // create the grid that will show the matchings
          var mg = []
          // if they want to see submissions first
          if (subFirstView) {
            for (var obj in matchedSubs) {
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={matchedSubs[obj]} progress={[0,1]}/>)
            }
          }
          else{
            for (var obj in matchedUsers) {
              mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={matchedUsers[obj]["name"]} submissions={matchedUsers[obj]["submissions"]} progressCaseTwo={[0,1]}/>)
            }
          }

          setMatchingGrid(mg);
        }
      },[subFirstView])

    // run algo, produce matchings
    async function createMatchings(data, setSubmitting) {
      setSubmitting(true);
      // console.log('form data:',graders,peers,submissions);
      // console.log('graders:',graders);
      let selectedGraders = graders.filter(function(ta){
        if(data.TA.includes(ta.name)){
          return ta;
        }
      });
      let algGraders = []
      for (let i in selectedGraders) {
        algGraders.push(selectedGraders[i]["id"])
      }
      algGraders = algGraders.sort(function(a, b){return a-b});
      setGrader(algGraders);
      let errHandle = "";

      try {
        const algOutput = await peerMatch(
          algGraders,
          peers,
          submissions,
          Number(data.peerLoad),
          Number(data.graderLoad)
        );

        const matchings = algOutput.matching;
        errHandle = algOutput.log;

        if (!algOutput.success) {
          console.log('algo failed',{log:errHandle})
          alert('Algorithm failed! Error Message: ' + errHandle);
          return;
        }

        console.log({matchings});

        let matched_users = {};
        let submissionBuckets = {};
        let prProgress = {};
        let grader, sub, user;
        // console.log({submissions});
        for (let i in matchings) {
          [grader, sub] = matchings[i];
          let subGroupString = ""
          // console.log({submissionGroups})
          for (let k in submissionGroups[sub]) {
            subGroupString += submissionGroups[sub][k]+", "
          }
          sub = subGroupString.slice(0,-2);
          if (!matched_users[grader]) {
            for (let j in users) {
              user = users[j];
              if (grader == user["canvasId"]) {
                matched_users[grader] = {
                  name: user["firstName"] + " " + user["lastName"],
                  enrollment: user["enrollment"],
                  submissions: []
                }
              }
            }
          }
          if (matched_users[grader]["submissions"]) {
            matched_users[grader]["submissions"].push(sub);
          } else {
            matched_users[grader]["submissions"] = [sub];
          }
          if (submissionBuckets[sub]) {
            submissionBuckets[sub].push(matched_users[grader]);
          } else {
            submissionBuckets[sub] = [matched_users[grader]];
            // prProgress[sub]
          }
        }
        // console.log({submissionBuckets})
        setMatchedUsers(matched_users);
        setMatchedSubs(submissionBuckets);

        // create the grid that will show the matchings
        var mg = []

        // if they want to see submissions first
        if (subFirstView) {
          // console.log(submissionBuckets);
          for (var obj in submissionBuckets) {
            const key = `sub: ${obj}; peers: ${submissionBuckets[obj].map(({name}) => name)}`;
            console.log(`submissionKey [${key}]`);
            mg.push(<MatchingCell subFirstView={subFirstView} key={key} submission={obj} peers={submissionBuckets[obj]} progress={[0,1]}/>)
          }
        }
        else{
          for (var obj in matched_users) {
            const key = `peer: ${matched_users[obj].name}; subs: ${matched_users[obj].submissions}`;
            console.log(`reviewerKey [${key}]`);
            mg.push(<MatchingCell subFirstView={subFirstView} key={key} reviewer={matched_users[obj].name} submissions={matched_users[obj].submissions} progressCaseTwo={[0,1]} />)
          }
        }

        setMatchingGrid(mg);
        setMatchings(matchings);
        setSubmitted(true);
        setSubmitting(false);
      } catch(err) {
        console.log({err})
        alert('Algorithm failed! Error Message: ' + errHandle);
      }

    }

    return (
      <div>
      <Formik
        initialValues={{ peerLoad: 3, graderLoad: 6, TA: [] }}
        onSubmit={async (data, { setSubmitting }) => {
          createMatchings(data, setSubmitting);
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Field
              name="peerLoad"
              type="input"
              value={values.peerLoad}
              label="Peer Load"
              required={true}
              as={TextField}
              className={styles.formfield}
            />
            <Field
              name="graderLoad"
              type="input"
              value={values.graderLoad}
              label="Grader Load"
              required={true}
              as={TextField}
              className={styles.formfield}
            />
            Graders: {/* why isn't the label working here ??  */}
            {tas.map(taList =>
              <Field
              key={taList}
              name="TA"
              className={styles.formfield}
              component={AutoComplete}
              required={true}
              label="TA"
              options={taList}
              />
            )
            }
            <Button disabled={isSubmitting} type="submit">
              Compute Matchings
            </Button>
            {/* <Button>Clear</Button> */}
            <Button onClick={() => setSubFirstView(!subFirstView)}>
            Toggle View
          </Button>
          </Form>
        )}
      </Formik>
      </div>
    );
  }



  export default Settings;
