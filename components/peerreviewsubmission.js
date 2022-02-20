import React, { useState, useEffect } from "react";
import Submission from "./submissionview";
import SubmissionCompleted from "./submissionviewcompleted";
import StudentViewOutline from './studentViewOutline';
import { useUserData } from "./storeAPI";
import styles from "./styles/peerreviewsubmissions.module.scss"

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

  if (id == undefined) {
    id = "";
  }

  const currentDate = new Date();
  const currentDateFormatted = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate() +' '+ currentDate.getHours()+':'+ currentDate.getMinutes()+':'+ currentDate.getSeconds();

  const reviewDueDate = new Date(dueDate);

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


  return (
    <div className={styles.mydiv}>
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
