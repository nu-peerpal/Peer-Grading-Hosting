import React, { useState } from "react";
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
import sampleData from "../../../sample_data/peerMatching";
import { peerMatch } from "../../api/AlgCalls.js";
import useSWR from "swr";

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function Settings({ graders, peers, submissions, setMatchings, setMatchingGrid }) {
  const [subFirstView, setSubFirstView] = useState(true); // true = submission first, false = reviewer first

  return (
    <Formik
      initialValues={{ peerLoad: 2, graderLoad: 3, TA: [] }}
      onSubmit={async (data, { setSubmitting }) => {
        setSubmitting(true);
        const matchings = await peerMatch(
          graders,
          peers,
          submissions,
          Number(data.peerLoad),
          Number(data.graderLoad)
        );
        let submissionBuckets = {};
        let userBuckets = {};
        let grader, sub;
        for (let i in matchings) {
          [grader, sub] = matchings[i];
          if (submissionBuckets[sub]) {
            submissionBuckets[sub].push(grader);
          } else {
            submissionBuckets[sub] = [grader];
          }
          if (userBuckets[grader]) {
            userBuckets[grader].push(sub);
          } else {
            userBuckets[grader] = [sub];
          }
        }

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
  );
}

// display submission and peers reviewing iit
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


  // NOTE: The following code should be removed upon usage of real data.
  const { graders, peers, submissions } = sampleData;

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
              graders={graders}
              peers={peers}
              submissions={submissions}
              setMatchings={setMatchings}
              setMatchingGrid={setMatchingGrid}
            />
          </AccordionDetails>
        </Accordion>
        {matchings.length > 0 && (
          <>
            {/* <div className={styles.result}>
              <span
                className={styles.result__header}
              >
                Submission
              </span>
              <span className={styles.result__header}>
                Matched Peer / Instructor
              </span>
            </div> */}
          </>
        )}

        <div className={styles.matchingGrid}>
          {matchingGrid}
        </div>
        {/* {subMatchings.map(obj=>
        <MatchingCell key={obj} submission={obj} peers={subMatchings[obj]}/>
          )} */}
        {/* <Tree id="tree" response={matchings} /> */}
      </Container>
    </div>
  );
}

export default Matching;
