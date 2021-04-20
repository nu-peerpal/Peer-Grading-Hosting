import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import { useUserData } from "../components/storeAPI";
const axios = require("axios");

const InProgress = props => {
  const { userId, courseId } = useUserData();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?courseId=${courseId}`).then(assignmentData => {
      console.log({assignmentData});
      setAssignments(assignmentData.data.data);
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
    </div>
  );
};

export default InProgress;
