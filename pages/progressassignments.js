import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import { useUserData } from "../components/storeAPI";
import StudentViewOutline from '../components/studentViewOutline';
const axios = require("axios");

const InProgress = props => {
  const { userId, courseId } = useUserData();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?courseId=${courseId}`).then(assignmentData => {
      console.log({assignmentData});
      let progressAssignments = assignmentData.data.data.filter(function(e){
        return e.reviewStatus < 9
      })
      //let unsorted_Assignments = progressAssignments
      //unsorted_Assignments.sort((a,b) => b.assignmentDueDate - a.assignmentDueDate).reverse()
      setAssignments(progressAssignments);
    });
  }, []);
  // const progress = [
  //   { name: "Assignment 2: Bid Analysis", info: "TA Grading" },
  //   { name: "Assignment 3: Online Learning", info: "Peer Review Stage" },
  //   { name: "Assignment 4", info: "Peer Matching Required" },
  // ];

  return (
    <div className="Content">
      <ListContainer
        name="Peer Review Enabled Assignments"
        data={assignments}
        link={"/assignments/fullassignmentview/fullassignmentview"}
      />
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default InProgress;
