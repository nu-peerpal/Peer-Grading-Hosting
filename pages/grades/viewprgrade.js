import React from "react";
import Container from "../../components/container";
import useSWR from "swr";
import StudentViewOutline from '../../components/studentViewOutline';

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

function ViewPRGrade() {
  const userId = 1;
  const assignmentId = 1;
  const { data: res } = useSWR(
    `/api/reviewGradesReports?assignmentId=${assignmentId}&userId=${userId}`,
    fetcher,
  );

  return (
    <div className="Content">
      <Container
        name={`Assignment ${assignmentId}: Peer Review Grade for User ${userId}`}
      >
        <div>User's Peer Review Grade: {res && res.data.grade}</div>
        <div>User's Peer Review Grade Report: {res && res.data.report}</div>
      </Container>
      <StudentViewOutline/>
    </div>
  );
}

export default ViewPRGrade;
