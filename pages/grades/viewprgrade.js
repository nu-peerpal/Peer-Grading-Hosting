import React from "react";
import Link from 'next/link'
import "./viewprgrade.module.css";
import Container from '../../components/container'
import useSWR from "swr";

const fetcher = (url) => fetch(url, { method: "GET" }).then((r) => r.json());

function ViewPRGrade() {
  const { data: reviewreport } = useSWR('/api/graded/peerReviews?assignmentId=1&userId=1', fetcher)
  return (
    <div class="Content">
      <Container name="Grade for Peer Review 1">
        {JSON.stringify(reviewreport)}
      </Container>
    </div>
  )
}

export default ViewPRGrade;
