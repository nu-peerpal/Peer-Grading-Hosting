import React, { useState, useEffect } from "react";
import Container from "../components/container";
//import styles from "./assignments/appeals/appeals.module.scss";
import styles from "./assignments/initialchecklist//initialchecklist.module.scss";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useRouter } from 'next/router';
import { useUserData } from "../components/storeAPI";
import StudentViewOutline from '../components/studentViewOutline';
import AutoComplete from "../components/autocomplete";
import Settings from "../components/settings";
import ReloadMatchings from "../components/reloadMatchings";
import InitialChecklist from "./assignments/initialchecklist/initialchecklist";
import { Field, Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import DatePickerField from "../components/datepickerfield";
import Cookies from 'js-cookie';

const axios = require("axios");

//settings for peer match, matching.js 'Josh test'
// bonus percent: added when TA doesn't grade a student's assignment
//localhost8081/courseSettings?assignmentname='name' assignmentid

function CourseSettings(props) {
  const { userId, courseId, courseName, assignment, createUser, savedStudentId } = useUserData();
  const router = useRouter();
  //const { assignmentId, assignmentName, rubricId } = router.query;
  const assignmentId = 109;
  const assignmentName = 'Null Group Test';
  const [appealDueDate, setAppealDueDate] = useState();
  const [loadedDeadline, setLoadedDeadline] = useState("");
  const [existingDueDate, setExistingDueDate] = useState(false);
  const [submitResponse, setSubmitResponse] = useState("");
  // matching.js
  const [matchings, setMatchings] = useState([]);
  const [matchingGrid, setMatchingGrid] = useState([]);
  const [matchingExists, setMatchingExists] = useState(false);
  const [peerReviews, setPeerReviews] = useState([]);
  const [submissionData, setSubmissionData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState("");
  const [userList, setUserList] = useState([]);
  //let {assignmentId, assignmentName} = router.query;
  //initialChecklist.js
  const [prEnabled, setPrEnabled] = React.useState(true); // true if peer reviews are enabled
  // const [dueDate, setDueDate] = React.useState(Date.now()); // original assignment due date
  const [rubricOptions, setRubricOptions] = React.useState([]); // displays all rubrics in Canvas
  const [prGroup, setPrGroup] = React.useState(-1); // list of group names and ids
  const [prGroupOptions, setPrGroupOptions] = React.useState([]); // list of group names
  const [prDueDate, setPrDueDate] = React.useState(null); // PR assignment due date
  const [prRubric, setPrRubric] = React.useState(-1); // selecting rubric ID for PR assignment
  //const { userId, courseId, assignment } = useUserData(); // data from LTI launch
  //const { assignmentId, assignmentName, dueDate } = router.query; // currently selected assignment from dashboard
  //const [prName, setPrName] = React.useState(assignmentName + " Peer Review"); //PR assignment name
  const [prName, setPrName] = useState("");
  const [fieldsReady, setFieldsReady] = React.useState(false);
  const dueDate = '2021-05-13T22:59:59';
  let localDate = new Date(dueDate);
  // const courseId = 1 // hardcoded
  // const assignmentId = 7
  // const assignmentName = "Peer Reviews Static"
  // console.log({rubricOptions});
  const [tas, setTas] = useState([]);
  const [bonusPercent, setBonusPercent] = useState();
  const [reviewRubric, setReviewRubric] = useState([]);
  const [matchingSettings, setMatchingSettings] = useState([]);
  const [matchingAlgo, setMatchingAlgo] = useState("");
  const [subGradeAlgo, setSubGradeAlgo] = useState("");
  const [prGradeAlgo, setPrGradeeAlgo] = useState("");
  const [addMatchAlgo, setAddMatchAlgo] = useState("");
  const [taList, setTaList] = useState({});
  const [peerLoad, setPeerLoad] = useState("");
  const [graderLoad, setGraderLoad] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const [initialData, setInitialData] = useState({
    peerLoad: "",
    graderLoad: "",
    bonusPercent: "",
    prAssignmentName: "",
    prAssignmentGroup: "",
    prDueDate: "",
    rubric: "",
    appealDueDate: "",
    tas: [],
    matchingAlgo: "", subGradeAlgo: "", prGradeAlgo: "", addMatchAlgo: "",
  });

  useEffect(() => {
    if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
      console.log('creating user data');
      const userData = JSON.parse(Cookies.get('userData'));
      console.log({ userData });
      // console.log('user data: ', userData);
      createUser(userData);
      setUserCreated(!userCreated);
    }
  }, []);

  function formatTimestamp(timestamp) {
    var d = new Date(timestamp);
    return ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear());
  }

  async function uploadRubrics(rawRubrics) {
    console.log('Uploading Rubrics...')
    var rubrics = rawRubrics.map(rubricObj => {
      // const rubric = rubricObj.data.map(rubricData => {
      //   return [rubricData.points, rubricData.description, rubricData.long_description]
      // })
      return {
        id: rubricObj.id,
        rubric: rubricObj.data
      }
    });
    console.log({ rubrics });
    const res = await axios.post(`/api/rubrics?type=multiple`, rubrics).catch(err => console.log('no new rubrics posted.'));
    console.log(res);
  }

  useEffect(() => {
    if (courseId != "") {
      Promise.all([axios.get(`/api/assignments/${assignmentId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),
      axios.get(`/api/canvas/rubrics?courseId=${courseId}`),
      axios.get(`/api/canvas/assignmentGroups?courseId=${courseId}`),
      axios.get(`/api/users?courseId=${courseId}&enrollment=TaEnrollment`),
      axios.get(`/api/courses/${courseId}`),
      ]).then(data => {
        let assignmentData = data[0].data.data;
        console.log(assignmentData);
        if (assignmentData.assignmentDueDate) {
          let formattedDate = formatTimestamp(assignmentData.assignmentDueDate);
          setLoadedDeadline(formattedDate);
          setExistingDueDate(true);
          console.log('got date:', formattedDate)
        }
        let peerReviewData = data[1].data.data;
        if (peerReviewData.length > 0) {
          setMatchingExists(true);
          setPeerReviews(peerReviewData)
        }
        setRubricOptions(data[2].data.data);
        setPrGroupOptions(data[3].data.data);
        let taNames = [];
        data[4].data.data.forEach(ta => {
          taNames.push(ta["firstName"] + " " + ta["lastName"]);
        })
        setTas([taNames]);
        let initial = data[5].data.data;
        initial.peerLoad = String(initial.peerLoad);
        initial.graderLoad = String(initial.graderLoad);
        
        if (!initial.tas) {
          initial.tas = {};
        }
        setInitialData(initial);
        console.log('initial data:', initial)
      })
    }
  }, [userCreated]);

  return (
    <div className="Content">
      <Container name={"Settings for assignment: " + assignmentName}>
        <div className={styles.desc}>
          <Formik
            enableReinitialize= {true}
            key={tas}
            initialValues={initialData}

            onSubmit={async (data, { setSubmitting }) => {

              let courseSettingsJson = {
                appealDueDate: appealDueDate,
                prDueDate: prDueDate,
                bonusPercent: bonusPercent,
                matchingAlgo: "",
                subGradeAlgo: "",
                prGradeAlgo: "",
                addMatchAlgo: "",
                assignmentName: prName,
                tas: data.TA, // or tas?
                peerLoad: peerLoad,
                graderLoad: graderLoad,
                matchingSettings: matchingSettings,
              };
              if (prRubric != -1) {
                courseSettingsJson.reviewRubric = prRubric;
              } else {
                courseSettingsJson.reviewRubric = null;
              }
              if (prGroup != -1) {
                courseSettingsJson.assignmentGroup = prGroup;
              } else {
                courseSettingsJson.assignmentGroup = null;
              }

              /* create handleSubmit function (no inputs)*/
              //axios.patch('/api/canvas/${canvasId}',all json objects updated)
              //console.log('coursesettings:', courseSettingsJson)
              axios.patch(`/api/courses/${courseId}`, courseSettingsJson).then(res => {
                console.log('coursesettings:', courseSettingsJson)
                console.log('res:', res)
              });
              console.log('data1:', data)
            }}
          >
            {({ values, handleChange, dirty }) => (
              <Form>
                <div className={styles.formfield}>
                  <div className={styles.rightBelow}>
                    Peer Load:
                    <div >
                      <Field
                        name="peerLoad"
                        type="input"
                        /* placeholder={initialData.peerLoad} */
                        /* value={values.peerLoad} */
                        required={true}
                        as={TextField}
                        className={styles.formfield}
                        value={values.peerLoad}
                        onKeyUp={
                          handleChange}
                        /* onChange={e => {
                          values.peerLoad = e.target.value;
                          setPeerLoad(e.target.value)
                          initialData.peerLoad = e.target.value
                        }} */
                      />
                    </div>
                  </div>
                  <div className={styles.left}>
                    <div className={styles.rightBelow}>
                      Grader Load:
                      <div >
                        <Field
                          name="graderLoad"
                          type="input"
                          value={values.graderLoad}
                          required={true}
                          as={TextField}
                          className={styles.formfield}
                          onKeyUp={handleChange}
                          /* onChange={e => {
                            values.graderLoad = e.target.value;
                            setGraderLoad(e.target.value)
                          }} */
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.below}>
                  TAs:
                  {tas.map(taList =>
                    <Field
                      key={taList}
                      name="tas"
                      component={AutoComplete}
                      required={true}
                      label="TA"
                      options={taList}
                      /* placeholder={initialData.tas} */
                      value={values.tas}
                      /* onKeyUp={handleChange} */
                      /* onKeyUp={handleChange.then(res => {
                        setTaList(e.target.value)
                        values.tas = e.target.value
                      })}*/

                      onChange={e => {
                        /* handleChange(e) */
                        values.tas = e.target.value
                        setTaList(e.target.value)
                        console.log('ta values:', e.target.value)
                      }}
                    />
                  )}
                </div>

                <div className={styles.below}>
                  Bonus Percent:
                  <div >
                    <Field
                      name="bonusPercent"
                      type="input"
                      required={true}
                      as={TextField}
                      className={styles.formfield}
                      value={values.bonusPercent}
                      onKeyUp={handleChange}
                      /* onChange={e => {
                        values.bonusPercent = e.target.value;
                        console.log('bonus:', values);
                        setBonusPercent(e.target.value)
                      }} */
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            %
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                </div>

                {/* peer review enabling section */}
                <div className={styles.below}>
                  <AccordionDetails>
                    <div className={styles.columnContainer}>
                      <div className={styles.column}>
                        <div className={styles.column__header}>
                          Assignment Name and Group
                        </div>
                        <div className={styles.column__content}>
                          Name of the peer review assignment:

                          <Field
                            name="prAssignmentName"
                            type="input"
                            value={values.prAssignmentName}
                            required={true}
                            as={TextField}
                            className={styles.formfield}
                            onKeyUp={handleChange}
                            /* onChange={e => {
                              values.prAssignmentName = e.target.value;
                              setPrName(e.target.value)
                            }} */
                          />

                        </div>
                        <br />

                        <div className={styles.column__content}>
                          Select peer review assignment group:

                        {/* <Field
                          //key={options}
                          name="Peer Review Assignment Group"
                          className={styles.formfield}
                          component={AutoComplete}
                          required={true}
                          label="Peer Review Assignment Group"
                          options={options}
                          onChange={e => { values.prGroupOptions = e.target.value }}
                        /> */}

                        {/* <Field key={prGroupOptions}
                          as="select"
                          name="peer review assignment group"

                          onChange={e => {
                            values.prAssignmentGroup = e.target.value;
                            console.log('bonus:', values);
                            setAssignmentGroup(e.target.value)
                            console.log('assignment group:', assignmentGroup)
                          }}
                        >
                          {prGroupOptions.map(option => {
                            console.log('options:', option)
                            values.prAssignmentGroup = option.name
                            setAssignmentGroup(option.name)
                            return (
                              <option value={option.id}> {option.name} </option>
                            )
                          })}
                        </Field> */}

                        
                          <div>
                          <select value={values.assignmentGroup}
                          /* onChange={e => setPrGroup(e.target.value)}  */
                          onKeyUp={handleChange}
                          name="assignmentGroup"
                          >
                            <option key={0} value={-1}>Select Assignment Group</option>
                            {/* <option key={0} value={-1}>{initialData.assignmentGroup}</option> */}
                            {prGroupOptions.map(prGroup => {
                              return <option key={prGroup.id} value={prGroup.name}>{prGroup.name}</option>;
                            })}
                          </select>
                          </div>
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
                            <p>{(localDate.getMonth() + 1) + '/' + localDate.getDate() + '/' + localDate.getFullYear()}</p>
                          </div>
                          <div style={{ marginTop: '25px' }}>
                            Due date for the peer review assignment:

                            <TextField
                              id="datetimelocal"
                              name="prDueDate"
                              type="datetime-local"
                              defaultValue={"2021-05-24T11:59:50Z"}
                              onKeyUp={handleChange}
                              /* onChange={e => {
                                values.prDueDate = e.target.value;
                                console.log('values:', values);
                                setPrDueDate(e.target.value + ":59-05:00")
                              }} */ // hardcode CT, might have to change with time shift
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />

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
                          {/* <form>
                          <Field key={rubricOptions}
                            as="select"
                            name="peer review rubric"

                          >
                            {rubricOptions.map(option => {
                              console.log('options:', option)
                              values.rubric = option.title
                              setReviewRubric(option.title)
                              return (
                                <option value={option.title}>{option.title} </option>
                              )
                            })}

                          </Field>
                        </form> */}

                        <div>
                          <select value={prRubric} 
                          /* onChange={e => setPrRubric(e.target.value)}  */
                          onKeyUp={handleChange}
                          >
                            <option key={0} value={-1}>Select Rubric</option>
                            {rubricOptions.map(rubricObj => {
                              /* console.log('rubric:', rubricObj) */
                              return <option key={rubricObj.id} value={rubricObj.title}>{rubricObj.title}</option>;
                            })}
                          </select>
                        </div>

                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </div>

                <AccordionDetails>
                  <div className={styles.formfield}>
                    <TextField className={styles.formfield}
                      name="appealDueDate"
                      id="datetime-local"
                      type="datetime-local"
                      label="Appeal Due Date"
                      onKeyUp={handleChange}
                      /* onChange={e => {
                        values.appealDueDate = e.target.value;
                        console.log('appeal:', values);
                        setAppealDueDate(e.target.value + ":59-05:00")
                      }} */ // hardcode CT, might have to change with time shift
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </AccordionDetails>

                <AccordionDetails>
                  <div className={styles.below}>
                    <Button variant="contained"
                      color="primary"
                      className="text-right"
                      /* onClick={handleSubmit} */
                      type="submit"
                      disabled={!dirty}> Update All </Button>
                    {submitResponse}
                  </div>
                </AccordionDetails>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
}

export default CourseSettings;
