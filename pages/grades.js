import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import StudentViewOutline from '../components/studentViewOutline';
import { useUserData } from "../components/storeAPI";
import SelectReviewAccordian from "../components/selectreviewaccordian";
import ViewAssignmentGradeComponent from "../components/viewgradescomponent";
const axios = require("axios");

function Grades(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [submissionGrades, setSubmissionGrades] = useState([]);
  const [gradedAssignments, setGradedAssignments] = useState([])
  const [reviewGrades, setReviewGrades] = useState([]);

  useEffect(() => {
    if (!courseId) {
      console.log("waiting for courseId");
      return;
    }

    axios.get(`/api/assignments?graded=true&courseId=${courseId}`).then(assignmentData => {
      let unsorted_Assignments = assignmentData.data.data
      unsorted_Assignments.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
      setGradedAssignments(unsorted_Assignments);

    })
  }, [courseId]);

  const listContainer = (
    <SelectReviewAccordian
      textIfEmpty="no submissions are graded"
      name="Graded Submissions"
      data={gradedAssignments}
      link="/grades/viewgrades"
      children={ViewAssignmentGradeComponent}
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
