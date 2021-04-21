import React, { useState, useEffect } from "react";
import ListContainer from "../components/listcontainer";
import { useUserData } from "../components/storeAPI";
const axios = require("axios");

const CompletedAssignments = () => {
  const { userId, courseId } = useUserData();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?courseId=${courseId}&graded=true`).then(assignmentData => {
      console.log({assignmentData});
      setAssignments(assignmentData.data.data);
    });
  }, []);
  // const completed = [{ name: "Assignment 1", info: "Completed 11/20/20" }];
  return (
    <div className="Content">
      <ListContainer
        name="Completed Peer Review Assignments"
        data={assignments}
        link="/assignments/fullassignmentview/fullassignmentview"
      />
    </div>
  );
};

export default CompletedAssignments;
