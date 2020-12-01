import React from "react";
import ListContainer from "../components/listcontainer";

const CompletedAssignments = props => {
  const completed = [{ name: "Assignment 1", info: "Completed 11/20/20" }];
  return (
    <div className="Content">
      <ListContainer
        name="Peer Assignments"
        data={completed}
        link="/assignments/fullassignmentview"
      />
    </div>
  );
};

export default CompletedAssignments;
