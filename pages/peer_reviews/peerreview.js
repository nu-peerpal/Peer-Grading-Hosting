import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Submission from "../../components/submissionVisualization/submissionview";
import SubmissionCompleted from "../../components/submissionVisualization/submissionviewcompleted"
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import { FormatColorResetTwoTone } from "@material-ui/icons";
import ButtonExample from '../../pages/peer_reviews/prbutton'
import {formatTimestampLikeCanvas} from "../../components/dateUtils";
// import TAGrading from "../grading/tagrading";
// import ReviewGradingTable from "../../components/UI/ReviewGradingTable";

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const PeerReview = (props) => {
  const { userId, courseId, courseName, assignment, roles } = useUserData();
  const [submission, setSubmission] = useState("");
  const [rubric, setRubric] = useState(null);
  const [isDocument, setIsDocument] = useState(false);
  const [review, setReview] = useState();
  const [taReviewReview, setTaReviewReview] = useState({});
  const [viewPeerReviewAssessment, setViewPeerReviewAssessment] = useState(true);
  const [instructor, setInstructor] = useState(false);
  const router = useRouter()
  const { submissionId, id, rubricId, matchingId, subId, dueDate } = router.query;

  const reviewDueDateFormatted = formatTimestampLikeCanvas(dueDate);
  const assignmentCompleted = isDisabled();

  useEffect(() => {
    (async () => {
      const [submission, matchingData, rubricData ] = await Promise.all([
        getData(`/api/submissions?type=peerreview&submissionId=${submissionId}&assignmentId=${id}`),
        getData(`/api/peerReviews/${matchingId}`),
        getData(`/api/rubrics/${rubricId}`),
        // getData(`/api/assignments/${assignmentName}`),
      ]);
      console.log('submission:',submission);
      console.log('rubric data:',rubricData);
      console.log('matching data:',matchingData);

      const reviewReview = matchingData.reviewReview;
      console.log('taReviewReview:',reviewReview);
      setTaReviewReview(reviewReview);

      // used to display submission
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

  // disabled for students if we are not at due date yet
  // ta/instructor can access and edit
  function isDisabled() {
    if (props.ISstudent) {
      return isDisabledRaw();
    }

    if (roles.includes("ta") || roles.includes("instructor")) {
      return false;
    }

    return isDisabledRaw();
  }

  // check if we are past due date by an hour
  function isDisabledRaw() {
    if (!dueDate)
      return true;

    const dueDateObj = new Date(dueDate);
    const ONE_HOUR = 60 * 60 * 1000;
    console.log('dates:',(new Date),dueDateObj)
    return ((new Date) - dueDateObj) > ONE_HOUR;
  }

  return (
    <div className="Content">
      {!rubric || <Container name={"Grade Submission " + subId}>
        { console.log({rubric}) }
        {assignmentCompleted ?
          <SubmissionCompleted
            instructor={instructor}
            taReviewReview={taReviewReview}
            matchingId={matchingId}
            dueDate={reviewDueDateFormatted}
            submission={submission}
            isDocument={isDocument}
            rubric={rubric}
            subId={subId}
            review={review}
            disabled={isDisabled()}
          />
          :
          <Submission
            instructor={instructor}
            taReviewReview={taReviewReview}
            matchingId={matchingId}
            dueDate={reviewDueDateFormatted}
            submission={submission}
            isDocument={isDocument}
            rubric={rubric}
            subId={subId}
            review={review}
            disabled={isDisabled()}
          />
        }
      </Container>}
      <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default PeerReview;
