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

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function Settings({ /*graders, peers, submissions,*/ setMatchings, setMatchingGrid }) {
  const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first
  const [matchedUsers, setMatchedUsers] = useState();
  const [matchedSubs, setMatchedSubs] = useState();
  const { userId, courseId, courseName, assignment, key, setKey } = useUserData();
  
  let users;
  let graders = []
  let peers = []
  let submissions = [];
  useEffect(() => {
    console.log('made it to useEffect 2!');
    // Not supporting groups. If so, add this to call promises: ,canvasCalls.getGroups(canvasCalls.token, courseId, assignment)
    Promise.all([canvasCalls.getUsers(canvasCalls.token, courseId),canvasCalls.getSubmissions(canvasCalls.token, courseId, assignment)]).then((canvasData) => {
      console.log(canvasData);
      users = canvasData[0];
      let submissionData = canvasData[1];
      // separate users, compile data for alg call
      let graderData = users.filter(user => user.enrollment == "TaEnrollment" || user.enrollment == "TeacherEnrollment");
      graders = []; 
      for (let grader in graderData) {
        graders.push(graderData[grader]["canvasId"]);
      }
      let peerData = users.filter(user => user.enrollment == "StudentEnrollment");
      peers = [];
      for (let peer in peerData) {
        peers.push(peerData[peer]["canvasId"]);
      }
      submissions = [];
      for (let sub in submissionData) {
        submissions.push([submissionData[sub]["submitterId"],submissionData[sub]["canvasId"]]);
      }
      console.log('alg data: ',graders,peers,submissions)
      // Uncomment to support groups
      // let groupData = canvasData[2];
      // let group_assignments;
      // let groups = [];
      // for (let group in groupData) { // in case you want to send groups to peerMatch
      //   group_assignments[group][groupData[group]["canvasId"]] = groupData[group][userIds];
      //   groups.push(groupData[group]["canvasId"]);
      // }

    });
  },[]);

// get all submissions

  return (
    <div>
    <Formik
      initialValues={{ peerLoad: 3, graderLoad: 10, TA: [] }}
      onSubmit={async (data, { setSubmitting }) => {
        setSubmitting(true);
        const matchings = await peerMatch(
          graders, // groups
          peers,
          submissions,
          Number(data.peerLoad),
          Number(data.graderLoad)
        );
        let matched_users = {};
        let submissionBuckets = {};
        let userBuckets = {};
        let grader, sub, user;
        for (let i in matchings) {
          [grader, sub] = matchings[i];
          for (let j in users) {
            user = users[j];
            if (grader == user["canvasId"]) {
              console.log('found a match!')
              matched_users[grader] = {
                name: user["firstName"] + " " + user["lastName"],
                enrollment: user["enrollment"],
                submissions: []
              }
              console.log(matched_users);
            }
          }
          // console.log('matched_users: ', matched_users)
          // console.log('gradermatch: ', grader, matched_users[grader]["submissions"]);
          console.log('grader: ',grader);
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
        setMatchedSubs(submissionBuckets);
        console.log(matchedUsers,matchedSubs);
        // convert groups to individuals
        // convert individual IDs to names

        console.log('Sub buckets: ', submissionBuckets);
        console.log('User buckets: ', userBuckets);

        // create the grid that will show the matchings
        var mg = []

        // if they want to see submissions first
        if (subFirstView) {
          for (var obj in submissionBuckets) {
            mg.push(<MatchingCell subFirstView={subFirstView} key={obj} submission={obj} peers={submissionBuckets[obj]} />)
          }
        }
        else{
          for (var obj in userBuckets) {
            mg.push(<MatchingCell subFirstView={subFirstView} key={obj} reviewer={obj} submissions={userBuckets[obj]} />)
          }
        }

        setMatchingGrid(mg);

        setMatchings(matchings);
        setSubMatchings(submissionBuckets);
        setSubmitting(false);
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
          <Field
            name="TA"
            className={styles.formfield}
            component={AutoComplete}
            required={true}
            label="TA"
            options={graders}
          />
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
      formattedPeers += (props.peers[i]);
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
    </div>
  );
}

export default Matching;
