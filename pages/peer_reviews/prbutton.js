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
import {formatTimestampLikeCanvas} from "../../components/dateUtils";

const getData = async url => {
    const res = await fetch(url);
    const resData = await res.json();
    return resData.data;
  };
  
  const ButtonExample = () => {
    const { userId, courseId, courseName, assignment, roles } = useUserData();
    const [submission, setSubmission] = useState("");
    const [rubric, setRubric] = useState([]);
    const [isDocument, setIsDocument] = useState(false);
    const [review, setReview] = useState();
    const [assignmentCompleted, setAssignmentCompleted] = useState(false);
    const [peerReviewDueDate, setPeerReviewDueDate] = useState("");
    const [taReviewReview, setTaReviewReview] = useState({});
    const [viewOtherPeerReviews, setViewOtherPeerReviews] = useState(true);
    const [instructor, setInstructor] = useState(false);
    const router = useRouter()
    let { submissionId, id, rubricId, matchingId, subId, dueDate } = router.query;
  
    // let presetComments = ReviewGradingTable;
    // console.log('presetComments:',presetComments);

  
    var currentDate = new Date();
    // const newCurrentDate = "Current Date and Time: "+date;
    // console.log('currentDateFormatted:',currentDateFormatted);
    // console.log('currentDate.getTime():',currentDate.getTime());
  
    var reviewDueDate = new Date(dueDate);
    // console.log('reviewDueDate:',reviewDueDate)
    // console.log('reviewDueDate.getTime():',reviewDueDate.getTime());
  
    var reviewDueDateFormatted = formatTimestampLikeCanvas(dueDate);
  
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
  
        const reviewReview = matchingData["reviewReview"];
        console.log('taReviewReview:',reviewReview);
        setTaReviewReview(reviewReview);
  
        if (submission.s3Link.includes('http')) { // if link, then view using iframe
          setIsDocument(true);
        }
        if (matchingData.review) {
          setReview(matchingData.review.reviewBody);
        }
        // test dates and add grace period
        if (currentDate.getTime() > (reviewDueDate.getTime() + 1 * 60 * 60 * 1000)) {
          setAssignmentCompleted(true)
        }
        setSubmission(submission);
        setRubric(rubricData.rubric);
        setPeerReviewDueDate(reviewDueDateFormatted)
  
        if (roles.includes('instructor')) {
          setInstructor(true);
        } else {
          setInstructor(false);
        }
  
      })();
    }, []);
  
    function isDisabled() {
      if (roles.includes("ta") || roles.includes("instructor")) {
        return false;
      }
      return false;
      // const dueDateObj = new Date(dueDate);
      // const ONE_HOUR = 60 * 60 * 1000;
      // return ((new Date) - dueDateObj) > ONE_HOUR;
    }
  
    // return (
    //   <div className="Content">
    //     <Container name={"Grade Submission " + subId}>
    //       {instructor == false ?
    //         <Box textAlign='center'>
    //           {/* <Button variant="contained" color="primary" onClick={handleClickSubmit}>Do not allow view of peer review grades to students</Button> */}
    //           <ButtonExample></ButtonExample>
    //           <br />
    //           <br />
    //           <br />
    //         </Box>
    //         :
    //         null
    //         }
    //       {(assignmentCompleted && viewOtherPeerReviews == true) ? 
    //         <SubmissionCompleted instructor={instructor} taReviewReview={taReviewReview} dueDate={peerReviewDueDate} matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} /> 
    //         : 
    //         <Submission instructor={instructor} dueDate={peerReviewDueDate} matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} />
    //       }
    //       {/* <Submission matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} /> */}
    //     </Container>
    //     <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    //   </div>
    // );

    return (
        <div>
            <Button onClick={() => setViewOtherPeerReviews(!viewOtherPeerReviews)}>
            {`Do not allow view of peer review grades to students: ${viewOtherPeerReviews ? 'off' : 'on'}`}
            </Button>
            <div>
                {assignmentCompleted && viewOtherPeerReviews ?
                <SubmissionCompleted instructor={instructor} taReviewReview={taReviewReview} dueDate={peerReviewDueDate} matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} /> 
                :
                <Submission instructor={instructor} dueDate={peerReviewDueDate} matchingId={matchingId} submission={submission} isDocument={isDocument} rubric={rubric} subId={subId} review={review} disabled={isDisabled()} />
                }
            </div>
        </div>
    );

  };


export default ButtonExample;