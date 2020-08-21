import React from "react";
import Link from 'next/link'
import styles from "./peerreview.module.css";
import Container from '../../components/container';
import Submission from '../../components/submissionview';
import useSWR from 'swr'

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

function PeerReview() {
  var submission = []
  var rubric = []
  const { data: info } = useSWR('/api/peerReviews/detailedView?submissionId=1&rubricId=1', fetcher)
  // console.log(info)
  if (info) {
    submission = info.SubmissionData[0].s3Link
    rubric = info.RubricData[0].rubric.rubricBody
    // console.log(rubric, 'tell me')
  }
  return (
    <div className="Content">
      <Container name="Grade User 1's Submission">
        {/* {console.log(rubric)} */}
        <Submission sublink={submission} rubric={rubric}/>
      </Container>
    </div>
  )
}

export default PeerReview;
