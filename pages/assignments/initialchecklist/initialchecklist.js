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
import { useUserData } from "../../../components/storeAPI";
import { useRouter } from 'next/router'
import { PanoramaFishEye } from "@material-ui/icons";


const InitialChecklist = () => {
  const router = useRouter()
  const [prEnabled, setPrEnabled] = React.useState(true); // true if peer reviews are enabled
  const [dueDate, setDueDate] = React.useState(Date.now()); // original assignment due date
  const [rubricOptions, setRubricOptions] = React.useState([]); // displays all rubrics in Canvas
  const [prGroup, setPrGroup] = React.useState(0); // list of group names and ids
  const [prGroupOptions, setPrGroupOptions] = React.useState([]); // list of group names
  const [prDueDate, setPrDueDate] = React.useState(Date.now()); // PR assignment due date
  const [rubricId, setRubricId] = React.useState(0); // selecting rubric ID for PR assignment
  // const { userId, courseId, assignment } = useUserData(); // data from LTI
  const { assignmentId, assignmentName } = router.query; // currently selected assignment from dashboard
  const [prName, setPrName] = React.useState(assignmentName + " Peer Review"); //PR assignment name
  // const courseId = 1 // hardcoded
  // const assignmentId = 7
  // const assignmentName = "Peer Reviews Static"

  const courseId = 1;

  useEffect(() => {
    // console.log('userid',userId,', coursid',courseId,', launch aid',assignment,', selectAid',assignmentId,', selectAName',assignmentName);
    canvasCalls.getRawRubrics(canvasCalls.token, courseId).then(response => {
      setRubricOptions(response)
    })
    canvasCalls.getAssignmentGroups(canvasCalls.token, courseId).then(response => {
      setPrGroupOptions(response);
    });

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
              Assignment Name and Group
            </div>
            <div className={styles.column__content}>
              Name of the peer review assignment:
              <form>
                <input type="text" value={prName} onChange={(e) => setPrName(e.target.value)} />
              </form>
            </div>
            <br/>
            <div className={styles.column__content}>
              Select peer review assignment group:
              <form>
                <select value={prGroup} onChange={e => setPrGroup(e.target.value)} >
                  {prGroupOptions.map(prGroup => {
                    return <option key={prGroup.id} value={prGroup.id}>{prGroup.name}</option>;
                  })}
                </select>
              </form>
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
              <form>
                <select value={rubricId} onChange={e => setRubricId(e.target.value)} >
                  {rubricOptions.map(rubricObj => {
                    return <option key={rubricObj.id} value={rubricObj.id}>{rubricObj.title}</option>;
                  })}
                </select>
              </form>
            </div>
          </div>
        </div>
      </Container>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Button onClick={() => {
          var rubric = null;
          var i;
          for (i = 0; i < rubricOptions.length; i++) {
            if (rubricOptions[i].id == rubricId) {
              rubric = rubricOptions[i];
              break;
            }
          }
          canvasCalls.createReviewAssignment(canvasCalls.token, courseId, assignmentId, assignmentName, dueDate, prName, prDueDate, prGroup, rubric).then(assignment => {
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
