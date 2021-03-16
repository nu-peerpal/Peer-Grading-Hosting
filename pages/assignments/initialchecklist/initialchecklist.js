import React, { useEffect } from "react";
import styles from "./initialchecklist.module.scss";
import Container from "../../../components/container";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { Field, Formik, Form } from "formik";
import sampleData from "../../../sample_data/peerMatching";
import AutoComplete from "../../../components/autocomplete";
import TextField from '@material-ui/core/TextField';
const canvasCalls = require("../../../canvasCalls");


const InitialChecklist = () => {
  const [prEnabled, setPrEnabled] = React.useState(true); // true if peer reviews are enabled
  const [dueDate, setDueDate] = React.useState(Date.now()); // original assignment due date
  const [rubricOptions, setRubricOptions] = React.useState([]); // displays all rubrics in Canvas
  const [rawRubrics, setRawRubrics] = React.useState([]); // raw canvas rubrics for input to createPeerReview
  const [prDueDate, setPrDueDate] = React.useState(Date.now()); // PR assignment due date
  const [rubric, setRubric] = React.useState(''); // selecting rubric for PR assignment

  const courseId = 1
  const assignmentId = 7
  const assignmentName = "Peer Reviews Testing"

  useEffect(() => {
    canvasCalls.getRawRubrics(canvasCalls.token, courseId).then(response => {
      const rubricNames = response.map(rubricObj => {
        return rubricObj.title
      })
      setRawRubrics(response)
      setRubricOptions(rubricNames)
    })

    setDueDate(null)
    setPrDueDate("2021-08-25T05:59:59Z")
    
  }, []); //only run if user Id is changed?

  return (
    <div className="Content">
      {/* peer review enabling section */}
      <Container name="Initialize Peer Review Assignment">
        <div className={styles.columnContainer}>
          <div className={styles.column}>
            <div className={styles.column__header}>
              Enable Peer Reviews
            </div>
            <div className={styles.column__content}>
              Peer Reviews are currently {prEnabled ? "enabled" : "disabled"}.
                <Button color={prEnabled ? "default" : "primary"} variant="contained" onClick={() => { setPrEnabled(!prEnabled) }}>
                {prEnabled ? "Disable" : "Enable"} Peer Reviews
                </Button>

            </div>
          </div>

          {/* due date editing / setting section */}
          <div className={styles.column}>
            <div className={styles.column__header}>
              Due Dates
            </div>
            <div className={styles.column__content}>
              Due date for the original assignment:
              <form noValidate>
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  defaultValue={"2021-05-24T11:59"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
              <div style={{marginTop: '25px'}}>
              Due date for the peer review assignment:
              <form noValidate>
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  defaultValue={"2021-05-24T11:59"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
              </div>

            </div>
          </div>

          {/* rubric selection section */}
          <div className={styles.column}>
            <div className={styles.column__header}>
              Rubrics
            </div>
            <div className={styles.column__content}>
              Select a rubric for the peer review assignment.
              <Formik
                initialValues={{ rubric: [] }}
                onSubmit={(data, { setSubmitting }) => {
                  setSubmitting(true)
                  var i;
                  for (i=0; i < rubricOptions.length; i++) {
                    if (rawRubrics[i].title === data.TA[0]) {
                      setRubric(rawRubrics[i]);
                      break;
                    };
                  };
                  // console.log(rubric)
                  setSubmitting(false)
                }
              }
              >
                {({ values, isSubmitting }) => (
                  <Form>
                    <Field as="select"
                      name="rubric"
                      component={AutoComplete}
                      label="rubric"
                      options={rubricOptions}
                      className={styles.dropdown}
                    />
                    <Button disabled={isSubmitting} type="submit" >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>

            </div>
          </div>
        </div>
      </Container>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button onClick={() => {
          canvasCalls.createReviewAssignment(canvasCalls.token, courseId, assignmentId, assignmentName, dueDate, prDueDate, rubric).then(assignment => {
            console.log(assignment)
            // canvasCalls.addReviewAssignment(canvasCalls.token, assignment)
          })
        }}>
          Create Peer Review Assignment
        </Button>
      </div>

    </div>
  );
};

export default InitialChecklist;
