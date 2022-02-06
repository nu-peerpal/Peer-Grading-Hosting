import React, { useState, useEffect } from "react";
import Container from "./container";
import Submission from "./submissionview";
import SubmissionCompleted from "./submissionviewcompleted";
import StudentViewOutline from './studentViewOutline';
import { useUserData } from "./storeAPI";
import styles from "./styles/peerreviewsubmissions.module.scss"
// import Button from "@material-ui/core/Button";
// import Box from '@material-ui/core/Box';
// import { FormatColorResetTwoTone } from "@material-ui/icons";
// import ButtonExample from '../../pages/peer_reviews/prbutton'
// import TAGrading from "../grading/tagrading";
// import ReviewGradingTable from "../../components/UI/ReviewGradingTable";

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const PeerReviewSubmission = (props) => {
  const { userId, courseId, courseName, assignment, roles } = useUserData();
  const [submission, setSubmission] = useState("");
  const [rubric, setRubric] = useState([]);
  const [isDocument, setIsDocument] = useState(false);
  const [review, setReview] = useState();
  const [taReviewReview, setTaReviewReview] = useState({});
  const [viewPeerReviewAssessment, setViewPeerReviewAssessment] = useState(true);
  const [instructor, setInstructor] = useState(false);
  let {isStudent, submissionId, id, rubricId, matchingId, subId, dueDate} = props;

  // props = Object.keys(props).map(key => key == undefined ? props.key = "" : props.key = props.key);
  // console.log("fixed props", props);

  if (id == undefined) {
    id = "";
  }


  // console.log("props", props);
  // console.log("matching id", matchingId);
  // console.log("submission id", submissionId);
  // console.log(" id", id);
  // console.log("rubric id", rubricId);
  // console.log("sub id", subId);
  // console.log("due date", dueDate);

  // let presetComments = ReviewGradingTable;
  // console.log('presetComments:',presetComments);

  // const current = new Date();
  // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  const currentDate = new Date();
  const currentDateFormatted = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate() +' '+ currentDate.getHours()+':'+ currentDate.getMinutes()+':'+ currentDate.getSeconds();
  // const newCurrentDate = "Current Date and Time: "+date;
  // console.log('currentDateFormatted:',currentDateFormatted);
  // console.log('currentDate.getTime():',currentDate.getTime());


  const reviewDueDate = new Date(dueDate);

  // console.log('reviewDueDate:',reviewDueDate)
  // console.log('reviewDueDate.getTime():',reviewDueDate.getTime());

  const reviewDueDateFormatted = reviewDueDate.getFullYear() + '-' + (reviewDueDate.getMonth()+1) + '-' + reviewDueDate.getDate() +' '+ reviewDueDate.getHours()+':'+ reviewDueDate.getMinutes()+':'+ reviewDueDate.getSeconds();

  const assignmentCompleted = isDisabled();
  console.log("peer review assignment completed", assignmentCompleted);


  useEffect(() => {
    (async () => {
      const [submission, matchingData, rubricData ] = await Promise.all([
        getData(`/api/submissions?type=peerreview&submissionId=${submissionId}&assignmentId=${id}`),
        getData(`/api/peerReviews/${matchingId}`),
        getData(`/api/rubrics/${rubricId}`),
        // getData(`/api/assignments/${assignmentName}`),
      ]);
      console.log('submission:',props.textIfEmpty + submission);
      console.log('rubric data:',props.textIfEmpty + JSON.stringify(rubricData));
      console.log('matching data:',matchingData);

      const reviewReview = matchingData["reviewReview"];
      console.log('taReviewReview:',reviewReview);
      setTaReviewReview(reviewReview);

      if (submission.s3Link.includes('http')) { // if link, then view using iframe
        setIsDocument(true);
      }
      if (matchingData.review) {
        setReview(matchingData.review.reviewBody);
      }

      setSubmission(submission);
      setRubric(rubricData.rubric);

      if (roles.includes('instructor')) {
        setInstructor(true);
      } else {
        setInstructor(false);
      }

    })();
  }, []);

  function isDisabled() {
    console.log("peer review is student", isStudent);
    if (isStudent) {
      return isDisabledRaw();
    }

    if (roles.includes("ta") || roles.includes("instructor")) {
      return false;
    }

    return isDisabledRaw();
  }

  function isDisabledRaw() {
    if (!dueDate)
      return true;

    const dueDateObj = new Date(dueDate);
    const ONE_HOUR = 60 * 60 * 1000;
    console.log('dates:',(new Date),dueDateObj)
    return ((new Date) - dueDateObj) > ONE_HOUR;
  }


  // function isInstructor() {
  //   if (roles.includes("instructor")) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // let instructor = isInstructor()


  // function handleClickSubmit() {
  //   setViewPeerReviewAssessment(!viewPeerReviewAssessment);
  // };


  return (
    <div className={styles.mydiv}>
        {/* {instructor == false ?
          <Box textAlign='center'>
            {/* <Button variant="contained" color="primary" onClick={handleClickSubmit}>
              Do not allow view of peer review assessment to students
            </Button> */}
            {/* {viewPeerReviewAssessment ?
              <Button variant="contained" color="primary" onClick={handleClickSubmit}>
              Do not allow view of peer review assessment to students
              </Button>
              :
              <Button variant="contained" color="primary" onClick={handleClickSubmit}>
              Allow view of peer review assessment to students
              </Button>
            }
            <br />
            <br />
            <br />
          </Box>
          :
          null
          } */}
        {assignmentCompleted ?
          <SubmissionCompleted instructor={instructor} taReviewReview={taReviewReview} matchingId={matchingId} dueDate={reviewDueDateFormatted} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} />
          :
          <Submission instructor={instructor} taReviewReview={taReviewReview} matchingId={matchingId} dueDate={reviewDueDateFormatted} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} />
        }
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );

};



export default PeerReviewSubmission;
