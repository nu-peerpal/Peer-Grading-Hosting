import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import StudentViewOutline from '../components/studentViewOutline';
import { useUserData } from "../components/storeAPI";
const axios = require("axios");

function Grades(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [submissionGrades, setSubmissionGrades] = useState([]);
  const [gradedAssignments, setGradedAssignments] = useState([])
  const [reviewGrades, setReviewGrades] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?graded=true&courseId=${courseId}`).then(assignmentData => {
      setGradedAssignments(assignmentData.data.data);

    })
  }, [])

  return (
    <div className="Content">
      {/* <ListContainer
        name="Graded Peer Reviews"
        data={reviewGrades}
        link="/grades/viewprgrade"
      /> */}
      <ListContainer
        name="Graded Assignments"
        data={gradedAssignments}
        link="/grades/viewgrades"
      />
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default Grades;
