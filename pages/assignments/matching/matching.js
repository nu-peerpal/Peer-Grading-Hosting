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

function Settings({ graders, peers, submissions, setMatchings }) {
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
        setMatchings(matchings);
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
        </Form>
      )}
    </Formik>
  );
}

function Matching() {
  const [matchings, setMatchings] = useState([]);

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
            />
          </AccordionDetails>
        </Accordion>
        {matchings.length > 0 && (
          <>
            <div className={styles.result}>
              <span
                className={styles.result__header}
              >
                Submission
              </span>
              <span className={styles.result__header}>
                Matched Peer / Instructor
              </span>
            </div>
          </>
        )}
        <Tree id="tree" response={matchings} />
      </Container>
    </div>
  );
}

export default Matching;
