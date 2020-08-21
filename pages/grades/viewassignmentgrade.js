import React from "react";
import Link from 'next/link'
import "./viewassignmentgrade.module.css";
import Container from '../../components/container'
import useSWR from "swr";

const fetcher = (url) => fetch(url, { method: "GET" }).then((r) => r.json());

function ViewAssignmentGrade() {
  const { data: submissionreport } = useSWR('/api/graded/assignments?id=1', fetcher)
  return (
    <div class="Content">
      <Container name="Grade for Assignment 1">
      {JSON.stringify(submissionreport)}
      </Container>  
    </div>
  )
}

export default ViewAssignmentGrade;
