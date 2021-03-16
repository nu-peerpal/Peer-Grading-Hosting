import React from "react";
import ListContainer from "../components/listcontainer";

const InProgress = props => {
  const progress = [
    { name: "Assignment 2: Bid Analysis", info: "TA Grading" },
    { name: "Assignment 3: Online Learning", info: "Peer Review Stage" },
    { name: "Assignment 4", info: "Peer Matching Required" },
  ];

  return (
    <div className="Content">
      <ListContainer
        name="Peer Assignments"
        data={progress}
        link={"/assignments/fullassignmentview/fullassignmentview"}
      />
    </div>
  );
};

export default InProgress;
