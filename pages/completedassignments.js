import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import AccordionContainer from "../components/accordioncontainer";
import SelectAssignment from "../components/selectassignment";
import { useUserData } from "../components/storeAPI";
import StudentViewOutline from '../components/studentViewOutline';
const axios = require("axios");

const CompletedAssignments = (props) => {
  const { userId, courseId } = useUserData();
  const [assignments, setAssignments] = useState([]);
  const [route,setRoute] = useState('/');

  useEffect(() => {
      if (!courseId) {
        console.log("wainting for courseId");
        return;
      }
//    if (props.ISstudent){
      axios.get(`/api/assignments?courseId=${courseId}&graded=true`).then(assignmentData => {
        console.log({assignmentData});
        let unsorted_Assignments = assignmentData.data.data
        unsorted_Assignments.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
        setAssignments(unsorted_Assignments);
        console.log(unsorted_Assignments)
        setRoute('/peer_reviews/selectReview')
      });
//    }
/*
    else {
      axios.get(`/api/assignments?courseId=${courseId}&reviewStatus=9`).then(assignmentData => {
        console.log({assignmentData});
        let unsorted_Assignments = assignmentData.data.data
        unsorted_Assignments.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
        setAssignments(unsorted_Assignments);
        console.log(unsorted_Assignments)
        setRoute('/assignments/fullassignmentview/fullassignmentview')
      });
    }
*/
}, [courseId]);
  // const completed = [{ name: "Assignment 1", info: "Completed 11/20/20" }];

  if (route === '/')
    return null;
  console.log("completed assignment props", assignments);

  const listContainer = (
    // <ListContainer
    <AccordionContainer
      textIfEmpty="no peer reviews are graded"
      name="Graded Reviews"
      data={assignments}
      link={route}
      hideDueDate={true}
      children={SelectAssignment}
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
};

export default CompletedAssignments;
