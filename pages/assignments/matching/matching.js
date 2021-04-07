import React, { useState, useEffect } from "react";
import styles from "./matching.module.scss";
import Container from "../../../components/container";
import Tree from "../../../components/tree";
import TextField from "@material-ui/core/TextField";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { Field, Formik, Form } from "formik";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import AutoComplete from "../../../components/autocomplete";
import UploadSubmissions from "../../../components/uploadSubmissions";
import sampleData from "../../../sample_data/peerMatching";
import { peerMatch } from "../../api/AlgCalls.js";
import useSWR from "swr";
import { useUserData } from "../../../components/storeAPI";
const canvasCalls = require("../../../canvasCalls");
const axios = require("axios");
const { server } = require("../../../config/index.js");

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function Settings({ /*graders, peers, submissions,*/ setMatchings, setMatchingGrid, setMatchedUsersOuter }) {
  const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
  const [tas, setTas] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState();
  const [matchedSubs, setMatchedSubs] = useState();
  const [users, setUsers] = useState();
  const [graders, setGraders] = useState([]);
  const [peers, setPeers] = useState([]);
  const [submissions,setSubmissions] = useState([]);
  const { userId, courseId, courseName, assignment } = useUserData();

  useEffect(() => {
    // get and parse canvas data (users, submissionos, groups)to run peerMatch algorithm
    Promise.all([canvasCalls.getUsers(canvasCalls.token, courseId),canvasCalls.getSubmissions(canvasCalls.token, courseId, assignment)/*,canvasCalls.getGroups(canvasCalls.token, courseId, assignment)*/]).then((canvasData) => {
      console.log(canvasData)
      let tempUsers = canvasData[0];
      let submissionData = canvasData[1];
      // console.log('ungrouped subs: ',submissionData)
      // let groupData = canvasData[2];
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
      let tempSubmissions = [];
      for (let sub in submissionData) {
        tempSubmissions.push([submissionData[sub]["submitterId"],submissionData[sub]["canvasId"]]);
      }
      // organize submissions
      
      // let group_assignments;
      // let groups = [];
      // for (let group in groupData) { // in case you want to send groups to peerMatch
      //   group_assignments[group][groupData[group]["canvasId"]] = groupData[group][userIds];
      //   groups.push(groupData[group]["canvasId"]);
      // }


      console.log('alg data: ',tempUsers,tempGraders,tempPeers,tempSubmissions)
      setTas([tempTas]);
      setUsers(tempUsers);
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
            mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={matchedSubs[obj]} />)
          }
        }
        else{
          for (var obj in matchedUsers) {
            mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={JSON.stringify(matchedUsers[obj]["name"])} submissions={JSON.stringify(matchedUsers[obj]["submissions"])} />)
          }
        }

        setMatchingGrid(mg);
      }
    },[subFirstView])

  // run algo, produce matchings
  async function createMatchings(data, setSubmitting) {
    setSubmitting(true);
    console.log('form data:',graders,peers,submissions);
    console.log('graders:',graders);
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
    
    // let graderList = data.TA;
    // console.log(graderList);

    console.log("peermatch data: ", algGraders, peers, submissions, Number(data.peerLoad), Number(data.graderLoad))
    const matchings = await peerMatch(
      algGraders, // groups
      peers,
      submissions,
      Number(data.peerLoad),
      Number(data.graderLoad)
    );
    console.log(matchings)
    let matched_users = {};
    let submissionBuckets = {};
    let grader, sub, user;
    for (let i in matchings) {
      // console.log('matching: ',matchings[i]);
      [grader, sub] = matchings[i];
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
      if (matched_users[grader]["submissions"]) {
        matched_users[grader]["submissions"].push(sub);
      } else {
        matched_users[grader]["submissions"] = [sub];
      }

      if (submissionBuckets[sub]) {
        submissionBuckets[sub].push(matched_users[grader]);
      } else {
        submissionBuckets[sub] = [matched_users[grader]];
      }
    }
    setMatchedUsers(matched_users);
    setMatchings(matchings);
    setMatchedSubs(submissionBuckets);

    // create the grid that will show the matchings
    var mg = []

    // if they want to see submissions first
    if (subFirstView) {
      // console.log(submissionBuckets);
      for (var obj in submissionBuckets) {
        mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={submissionBuckets[obj]} />)
      }
    }
    else{
      for (var obj in matched_users) {
        mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={matched_users[obj]["name"]} submissions={matched_users[obj]["submissions"]} />)
      }
    }

    setMatchingGrid(mg);
    setSubmitting(false);
  }

  return (
    <div>
    <Formik
      initialValues={{ peerLoad: 3, graderLoad: 10, TA: [] }}
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
          TAs: {/* why isn't the label working here ??  */}
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
          <Button>Clear</Button>
          <Button onClick={() => setSubFirstView(!subFirstView)}>
          Toggle View
        </Button>
        </Form>
      )}
    </Formik>
    </div>
  );
}

// display submission and peers reviewing it
function MatchingCell(props) {

  // nicely format the list of peers reviewing the submissions
  var formattedPeers = "";
  if (props.peers){
    for (var i = 0; i < props.peers.length; i++) {
      formattedPeers += (JSON.stringify(props.peers[i]["name"]));
      formattedPeers += (", ")
    }
  }

   if (!props.reviewer){
    return (
      <div className={styles.matchingCell}>
        <div>
          <p className={styles.matchingCell__title}>Submission #:</p>
          <p className={styles.matchingCell__value}>{props.submission}</p>
        </div>
        <div>
          <p className={styles.matchingCell__title}>Reviewers:</p>
          <p className={styles.matchingCell__value}>{formattedPeers.slice(0, -2)}</p>
        </div>
      </div>
    );
  }
  else{
    return (
      <div className={styles.matchingCell}>
        <div>
          <p className={styles.matchingCell__title}>Reviewer #:</p>
          <p className={styles.matchingCell__value}>{props.reviewer}</p>
        </div>
        <div>
          <p className={styles.matchingCell__title}>Submissions:</p>
          <p className={styles.matchingCell__value}>{props.submissions}</p>
        </div>
      </div>
    );
  }

}

function Matching() {
  const [matchings, setMatchings] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  // const [matchedUsers, setMatchedUsers] = useState([]);
  const { userId, courseId, courseName, assignment, key, setKey } = useUserData();


  // NOTE: The following code is completely fake sample data. 
  // const { graders, peers, submissions } = sampleData;
  // NOTE: The following code is fetched directly from cavas.
  
  

  /* NOTE: The following code should be used instead when real data populated in database.
  const courseId = 1;
  const assignmentId = 1;

  let { data: gradersRes } = useSWR(
    `/api/users?courseId=${courseId}&enrollment=ta`,
    fetcher
  );
  let { data: peersRes } = useSWR(
    `/api/users?courseId=${courseId}&enrollment=student`,
    fetcher
  );
  let { data: submissionsRes } = useSWR(
    `/api/submissions?assignmentId=${assignmentId}`,
    fetcher
  );
  
  let graders, peers, submissions;
  graders = peers = submissions = [];
  if (submissionsRes && peersRes && gradersRes) {
    // transform to match algorithm input format
    graders = gradersRes.data.map(user => user.id);
    peers = peersRes.data.map(user => user.id);
    submissions = submissionsRes.data.map(submission => [
      submission.groupId,
      submission.id
    ]);
  } */

  function handleSubmit() {
    const peerMatchings = matchings.map(matching => {
      return {
        matchingType: "initial",
        review: null,
        reviewReview: null,
        assignmentId: assignment,
        submissionId: matching[1],
        userId: matching[0]
      }
    })
    console.log("POST peer matchings")
    axios.post(`${server}/api/peerReviews?type=multiple`, peerMatchings)
    .then(res => console.log("res", res))
    .catch(err => console.log(err));
  }

  return (
    <div className="Content">
      <Container name="Peer Matching">
        <Accordion className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Settings
          </AccordionSummary>
          <AccordionDetails>
            <Settings
              // graders={graders}
              // peers={peers}
              // submissions={submissions}
              setMatchings={setMatchings}
              setMatchingGrid={setMatchingGrid}
            />
          </AccordionDetails>
        </Accordion>

        <div className={styles.matchingGrid}>
          {matchingGrid}
        </div>
      </Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button onClick={handleSubmit}>
          Confirm Matchings
        </Button>
      </div>
    </div>
  );
}

export default Matching;
