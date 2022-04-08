import React, { useState, useEffect } from "react";
import Container from "../../components/container";
//import styles from "./assignments/appeals/appeals.module.scss";
import styles from "./coursesettings.module.scss";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useRouter } from 'next/router';
import { useUserData } from "../../components/storeAPI";
import StudentViewOutline from '../../components/studentViewOutline';
import AutoComplete from "../../components/autocomplete";
import Settings from "../../components/settings";
import ReloadMatchings from "../../components/reloadMatchings";
import InitialChecklist from "../assignments/initialchecklist/initialchecklist";
import { Field, Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import DatePickerField from "../../components/datepickerfield";
import Cookies from 'js-cookie';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SubmitButton from '../../components/submitButton';
import Alert from '@material-ui/lab/Alert';
import Link from 'next/link'

const axios = require("axios");

//settings for peer match, matching.js 'Josh test'
// bonus percent: added when TA doesn't grade a student's assignment
//localhost8081/courseSettings?assignmentname='name' assignmentid

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(ta, tas, theme) {
  return {
    fontWeight:
      tas.indexOf(ta) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function CourseSettings(props) {
  console.log('props:', props);
  const { userId, courseId, courseName, assignment, createUser, savedStudentId } = useUserData();
  console.log('useUserData:', useUserData());
  const router = useRouter();
  //const { assignmentId, assignmentName, rubricId } = router.query;
  const assignmentId = 109;
  const assignmentName = 'Null Group Test';
  const [appealDueDate, setAppealDueDate] = React.useState("");
  const [loadedDeadline, setLoadedDeadline] = useState("");
  const [existingDueDate, setExistingDueDate] = useState(false);
  const [submitResponse, setSubmitResponse] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
  const [prDueDate, setPrDueDate] = React.useState(""); // PR assignment due date
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
  const classes = useStyles();
  const theme = useTheme();
  const [tas, setTas] = React.useState([]);
  const [bonusPercent, setBonusPercent] = useState();
  const [reviewRubric, setReviewRubric] = useState([]);
  const [matchingSettings, setMatchingSettings] = useState([]);
  const [matchingAlgo, setMatchingAlgo] = useState("");
  const [subGradeAlgo, setSubGradeAlgo] = useState("");
  const [prGradeAlgo, setPrGradeeAlgo] = useState("");
  const [addMatchAlgo, setAddMatchAlgo] = useState("");
  const [taList, setTaList] = useState({});
  const [taNames, setTaNames] = React.useState([]);
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
  const [courseSettingsJsonObj, setCourseSettingsJsonObj] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [anyChanges, setAnyChanges] = useState('disable');
  const [assignments, setAssignments] = React.useState([]);
  const [currentAssignment, setCurrentAssignment] = useState('');
  console.log('canvasform props:', props);
  let alert = (
    <Alert style={{ marginLeft: '10px' }} severity={submitSuccess ? "success" : "error"}>{submitResponse}</Alert>
  )
  let moreChanges = (
    <Button variant="secondary"
      color="primary"
      onClick={() => {
        setShowAlert(false);
        setSubmitted(false);
      }}
      type="reset"
    > Click here to edit form again </Button>
  )

  let homePage = (
    /* <Link href={{pathname: `../`}} className="btn btn-primary">
          Home</Link>
          <Button href={`../`}>Link</Button> */
    /* <TableCell className={styles.info}> */
    <Link href={{ pathname: `../` }}>
      <Button variant="contained" className="is-rounded">
        Home
      </Button>
    </Link>
    /* </TableCell> */
  )

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

  function toDate(timestamp) {
    var d = new Date(timestamp);
    var currentMonth = d.getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    var currentDay = d.getDate();
    if (currentDay < 10) {
      currentDay = '0' + currentDay;
    }
    var currentHour = d.getHours();
    if (currentHour < 10) {
      currentHour = '0' + currentHour;
    }
    var currentMinute = d.getMinutes();
    if (currentMinute < 10) {
      currentMinute = '0' + currentMinute;
    }

    var date = (d.getFullYear() + '-' + currentMonth + '-' + currentDay + 'T' + currentHour + ':' + currentMinute + ':59');
    console.log('toDate date:', date);
    return date;
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

  const handleChange = (event) => {
    setCurrentAssignment(event.target.value);
  };

  useEffect(() => {
    if (courseId != "") {
      console.log('courseId:',courseId)
      Promise.all([axios.get(`/api/assignments/${assignmentId}`),
      axios.get(`/api/peerReviews?assignmentId=${assignmentId}`),
      axios.get(`/api/canvas/rubrics?courseId=${courseId}`),
      axios.get(`/api/canvas/assignmentGroups?courseId=${courseId}`),
      axios.get(`/api/users?courseId=${courseId}&enrollment=TaEnrollment&enrollment=InstructorEnrollment`),
      axios.get(`/api/courses/${courseId}`),
      axios.get(`/api/assignments?courseId=${courseId}`),
      axios.get(`/api/assignment_submissions?id=294`)
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
        console.log('settas:', [taNames])
        console.log('settanames:', taNames)
        setTas([taNames]);
        setTaNames(taNames);
        let initial = data[5].data.data;
        initial.peerLoad = String(initial.peerLoad);
        initial.graderLoad = String(initial.graderLoad);
        console.log('initial pr due date type:', typeof initial.prDueDate);
        initial.prDueDate = toDate(initial.prDueDate);
        initial.appealDueDate = toDate(initial.appealDueDate);
        console.log('initial pr due date', initial.prDueDate);
        console.log('initial appeal due date', initial.appealDueDate);
        /* initial.prDueDate = formatTimestamp(initial.prDueDate);
        initial.appealDueDate = formatTimestamp(initial.appealDueDate) */
        let canvasAssignments = [];
        data[6].data.data.forEach(assignment => {
          canvasAssignments.push(assignment.name);
        })
        setAssignments(canvasAssignments);
        console.log('tas: ', initial.tas)
        console.log('canvas assignment names: ', canvasAssignments)

        if (!initial.tas) {
          initial.tas = {};
        }
        setInitialData(initial);
        console.log('initial data:', initial)
        console.log('date today: ', Date.now())
        console.log('date today type:', typeof Date.now())
      })
    }
  }, [userCreated]);

  return (
    <div className="Content">
      <Container
        //                                                 CHANGE TO DROPDOWN
        // name={"Settings for Course Using Assignment: " + assignments[0].name}
        name={"Settings for Course Using Assignment: " + currentAssignment}
      >
        <TableCell
          /* className={styles.name}  */
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: '15pt',
          }}>
          Select Assigment in Course:
          <FormControl variant="outlined" style={{ marginLeft: '15px' }}>
            <InputLabel > Assignment </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              style={{ width: '200px' }}
              name="assignment"
              value={currentAssignment}
              onChange={handleChange}
            >
              {assignments.map((name) => (
                <MenuItem key={name} value={name} >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <div className={styles.below} >
        </div>

        <div className={styles.desc}>
          <Formik
            enableReinitialize={true}
            key={tas}
            initialValues={initialData}

            onSubmit={(data, { setSubmitting }) => {
              /* tas prop to general component */
              console.log('onsubmit data:', data)
              let courseSettingsJson = {
                appealDueDate: data.appealDueDate,
                prDueDate: data.prDueDate,
                bonusPercent: data.bonusPercent,
                matchingAlgo: "",
                subGradeAlgo: "",
                prGradeAlgo: "",
                addMatchAlgo: "",
                assignmentName: data.assignmentName,
                /* tas: data.TA, // or tas? */
                tas: data.tas,
                peerLoad: data.peerLoad,
                graderLoad: data.graderLoad,
                matchingSettings: data.matchingSettings,
                assignmentDateToPrDate: data.assignmentDateToPrDate,
                prDateToAppealDate: data.prDateToAppealDate,
              };
              if (data.reviewRubric != -1) {
                courseSettingsJson.reviewRubric = data.reviewRubric;
              } else {
                courseSettingsJson.reviewRubric = null;
              }
              if (data.assignmentGroup != -1) {
                courseSettingsJson.assignmentGroup = data.assignmentGroup;
              } else {
                courseSettingsJson.assignmentGroup = null;
              }
              setCourseSettingsJsonObj(courseSettingsJson);
              console.log('coursesettingsjsonobj:', courseSettingsJsonObj);

              axios.patch(`/api/courses/${courseId}`, courseSettingsJson).then(res => {
                if (res.status == 200) {
                  setSubmitResponse("Changes set.")
                  setExistingDueDate(true);
                  setSubmitSuccess(true);
                  setShowAlert(true);
                  setAnyChanges('disable');
                  console.log('submitted:', submitted)
                  setSubmitted(true);
                  console.log('coursesettings:', courseSettingsJson)
                  console.log('after pr due date type:', typeof courseSettingsJson.prDueDate)
                  console.log('res:', res)
                  console.log('data1:', data)
                  console.log('data1 appeal due date:', data.appealDueDate)
                  console.log('data1 pr due date:', data.prDueDate)
                }
              }).catch(err => {
                setSubmitResponse("Something went wrong.")
                setSubmitSuccess(false);
              })
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
                        onKeyUp={handleChange}
                        disabled={submitted}
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
                          disabled={submitted}
                        /* onChange={e => {
                          values.graderLoad = e.target.value;
                          setGraderLoad(e.target.value)
                        }} */
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /api/users */}
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
                      disabled={submitted}
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

                {/* rubrics */}
                <div className={styles.below} >
                  TAs and Instructors Responsible for Grading this Course:
                  <InputLabel id="demo-mutiple-checkbox-label"></InputLabel>
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    name="tas"
                    multiple
                    value={values.tas}
                    onChange={handleChange}
                    disabled={submitted}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {tas.map((name) => (
                      <MenuItem key={name} value={name} >
                        <Checkbox checked={values.tas.indexOf(name) > -1} />
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
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
                            name="assignmentName"
                            type="input"
                            value={values.assignmentName}
                            required={true}
                            as={TextField}
                            className={styles.formfield}
                            onKeyUp={handleChange}
                            disabled={submitted}
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
                              onChange={handleChange}
                              disabled={submitted}
                              name="assignmentGroup"
                            >
                              <option key={0} value={-1}>Select Assignment Group</option>
                              {/* <option key={0} value={-1}>{initialData.assignmentGroup}</option> */}
                              {prGroupOptions.map(prGroup => {
                                return <option key={prGroup.id} value={prGroup.id}>{prGroup.name}</option>;
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
                              /* type="datetime-local" */
                              type="datetime-local"
                              /* defaultValue="2021-05-24T11:59" */
                              value={values.prDueDate}
                              /* value={values.prDueDate} */
                              onChange={handleChange}
                              disabled={submitted}
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
                          <div style={{ marginTop: '25px' }}>
                            Appeals Due Date:
                            <TextField className={styles.formfield}
                              name="appealDueDate"
                              id="datetimelocal"
                              type="datetime-local"
                              value={values.appealDueDate}
                              onChange={handleChange}
                              disabled={submitted}
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
                          <div className={styles.left}>
                    <div className={styles.rightBelow}>
                      Number of Days from Original Due Date to Peer Review Due Date:
                      <div >
                        <Field
                          name="assignmentDueDateToPrDueDate"
                          type="input"
                          value={values.assignmentDateToPrDate}
                          required={true}
                          as={TextField}
                          className={styles.formfield}
                          onKeyUp={handleChange}
                          disabled={submitted}
                        /* onChange={e => {
                          values.graderLoad = e.target.value;
                          setGraderLoad(e.target.value)
                        }} */
                        />
                      </div>
                    </div>
                  </div><div className={styles.left}>
                    <div className={styles.rightBelow}>
                      Number of Days from Peer Review Due Date to Appeal Due Date:
                      <div >
                        <Field
                          name="prDueDateToAppealDueDate"
                          type="input"
                          value={values.prDateToAppealDate}
                          required={true}
                          as={TextField}
                          className={styles.formfield}
                          onKeyUp={handleChange}
                          disabled={submitted}
                        /* onChange={e => {
                          values.graderLoad = e.target.value;
                          setGraderLoad(e.target.value)
                        }} */
                        />
                      </div>
                    </div>
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
                            <select value={values.reviewRubric}
                              /* onChange={e => setPrRubric(e.target.value)}  */
                              id="reviewRubric"
                              name="reviewRubric"
                              onChange={handleChange}
                              disabled={submitted}
                            >
                              <option key={0} value={-1}>Select Rubric</option>
                              {rubricOptions.map(rubricObj => {
                                /* console.log('rubric:', rubricObj) */
                                return <option key={rubricObj.id} value={rubricObj.id}>{rubricObj.title}</option>;
                              })}
                            </select>
                          </div>

                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </div>

                {/* <AccordionDetails>
                  <TableRow className={styles.row}>
                    <div className={styles.submitContainer}>
                      <Button variant="contained"
                        color="primary"
                        className="text-right"
                        type="submit"
                        disabled={!dirty || submitted}> Update Changes </Button>
                      {showAlert ? alert : null}
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingLeft: '50px' }}>
                        {showAlert ? moreChanges : null}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.info}>
                          {showAlert ? homePage : null}
                        </div>
                      </div>
                    </div>

                  </TableRow>
                </AccordionDetails> */}

                <div className={styles.below}>
                  <Table className={styles.tables}>
                    <TableBody>
                      <TableRow className={styles.row}>
                        <TableCell className={styles.name} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                          <Button variant="contained"
                            color="primary"
                            className="text-right"
                            type="submit"
                            disabled={!dirty || submitted}> Update Changes </Button>

                          {showAlert ? alert : null}
                        </TableCell>
                        {/* <div style={{ marginLeft: '50px' }}> */}
                        <TableCell >
                          {showAlert ? moreChanges : null}
                        </TableCell>
                        <TableCell className={styles.info}>

                          <div className={styles.info}>
                            {showAlert ? homePage : null}
                          </div>

                        </TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </div>

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
