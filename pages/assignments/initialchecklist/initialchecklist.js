import React, { useEffect } from "react";
import styles from "./initialchecklist.module.scss";
import Container from "../../../components/container";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { Field, Formik, Form } from "formik";
import sampleData from "../../../sample_data/peerMatching";
import AutoComplete from "../../../components/autocomplete";
import TextField from '@material-ui/core/TextField';
import { useUserData } from "../../../components/storeAPI";
import { useRouter } from 'next/router'
import { PanoramaFishEye } from "@material-ui/icons";
import StudentViewOutline from '../../../components/studentViewOutline';
const axios = require("axios");


const InitialChecklist = (props) => {
  const router = useRouter()
  const [prEnabled, setPrEnabled] = React.useState(true); // true if peer reviews are enabled
  // const [dueDate, setDueDate] = React.useState(Date.now()); // original assignment due date
  const [rubricOptions, setRubricOptions] = React.useState([]); // displays all rubrics in Canvas
  const [prGroup, setPrGroup] = React.useState(-1); // list of group names and ids
  const [prGroupOptions, setPrGroupOptions] = React.useState([]); // list of group names
  const [prDueDate, setPrDueDate] = React.useState(null); // PR assignment due date
  const [rubricId, setRubricId] = React.useState(-1); // selecting rubric ID for PR assignment
  const { userId, courseId, assignment } = useUserData(); // data from LTI launch
  const { assignmentId, assignmentName, dueDate } = router.query; // currently selected assignment from dashboard
  const [prName, setPrName] = React.useState(assignmentName + " Peer Review"); //PR assignment name
  const [fieldsReady, setFieldsReady] = React.useState(false);
  // const courseId = 1 // hardcoded
  // const assignmentId = 7
  // const assignmentName = "Peer Reviews Static"
  // console.log({rubricOptions});
  async function uploadRubrics(rawRubrics) {
    console.log('Uploading Rubrics...')
    var rubrics = rawRubrics.map(rubricObj => {
      // const rubric = rubricObj.data.map(rubricData => {
      //   return [rubricData.points, rubricData.description, rubricData.long_description]
      // })
      return {
        id: rubricObj.id,
        rubric: rubricObj.data}
    });
    console.log({rubrics});
    const res = await axios.post(`/api/rubrics?type=multiple`, rubrics);
    console.log(res);
  }

  function handleSubmit() {
    var rubric = null;
    var i;
    uploadRubrics(rubricOptions);
    
    for (i = 0; i < rubricOptions.length; i++) {
      if (rubricOptions[i].id == rubricId) {
        rubric = rubricOptions[i];
        break;
      }
    }
    const reviewAssignment = {
      courseId: courseId,
      assignmentName: assignmentName,
      prName: prName,
      prDueDate: prDueDate,
      prGroup: prGroup,
      rubric: rubric
    }
    axios.post(`/api/canvas/createReviewAssignment`, reviewAssignment).then(assignment => {
      assignment = assignment.data.data
      console.log({assignment})
      assignment["reviewRubricId"] = parseInt(rubricId);
      if (dueDate != "") {
        assignment["assignmentDueDate"] = dueDate.replace("T", " ");
      }
      assignment["canvasId"] = parseInt(assignmentId);
      assignment["id"] = parseInt(assignmentId);
      assignment["rubricId"] = parseInt(router.query.rubricId);
      axios.post(`/api/assignments`, assignment)
    })
  }

  useEffect(() => {
    axios.get(`/api/canvas/rubrics?courseId=${courseId}`).then(response => {
      // console.log('rubrics: ', response.data.data)
      setRubricOptions(response.data.data);
    });
    axios.get(`/api/canvas/assignmentGroups?courseId=${courseId}`).then(response => {
      setPrGroupOptions(response.data.data);
    });
    // setDueDate(null)
    
  }, []);

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
                <option key={0} value={-1}>Select Assignment Group</option>
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
              <div>
                <p>{dueDate}</p>
              </div>
              <div style={{marginTop: '25px'}}>
              Due date for the peer review assignment:
              <form noValidate>
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  defaultValue={"2021-05-24T11:59:50Z"}
                  onChange={e => setPrDueDate(e.target.value+":59Z")}
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
                <option key={0} value={-1}>Select Rubric</option>
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
      {rubricId != -1 && prGroup != -1 && prDueDate && <Button onClick={handleSubmit}>
          Create Peer Review Assignment
        </Button>}
      </div>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default InitialChecklist;
