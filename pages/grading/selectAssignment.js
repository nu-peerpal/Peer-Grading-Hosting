import React, { useState, useEffect } from "react";
import ListContainer from "../../components/listcontainer";
import { useUserData } from "../../components/storeAPI";
import StudentViewOutline from '../../components/studentViewOutline';
const axios = require("axios");

const SelectAssignment = props => {
  const { userId, courseId } = useUserData();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`/api/assignments?courseId=${courseId}`).then(assignmentData => {
      console.log({assignmentData});
      setAssignments(assignmentData.data.data);
    });
  }, []);

  return (
    <div className="Content">
      <ListContainer
        name="Select Assignment to Review Reviews"
        data={assignments}
        link={"/grading/selectTaGrading"}
      />
      <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectAssignment;
