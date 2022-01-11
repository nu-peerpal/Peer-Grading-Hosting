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
      let unsorted_Assignments = assignmentData.data.data
      unsorted_Assignments.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
      setGradedAssignments(unsorted_Assignments);

    })
  }, [])

  const listContainer = (
    <ListContainer
      textIfEmpty="no submissions are graded"
      name="Graded Submissions"
      data={gradedAssignments}
      link="/grades/viewgrades"
    />
  );

  if (!props.SetIsStudent)
    return listContainer;

  // if standalone page
  return (
    <div className="Content">
      {listContainer}
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
}

export default Grades;
