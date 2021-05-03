import React, { useState, useEffect } from "react";
import ListContainer from "../../components/listcontainer";
import { useUserData } from "../../components/storeAPI";
import StudentViewOutline from '../../components/studentViewOutline';
import Cookies from 'js-cookie';
const axios = require("axios");

const SelectAssignment = props => {
  const { userId, courseId, createUser, savedStudentId } = useUserData();
  const [assignments, setAssignments] = useState([]);
  const [userDataUpdated, setUserDataUpdated] = useState(false);

  useEffect(() => {
    if (!userId) { // check if user state is active
      if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
        console.log('recreating user data');
        const userData = JSON.parse(Cookies.get('userData'));
        createUser(userData);
        setUserDataUpdated(!userDataUpdated);
      }
    }
  }, []);
  useEffect(() => {
    axios.get(`/api/assignments?courseId=${courseId}`).then(assignmentData => {
      console.log({assignmentData});
      setAssignments(assignmentData.data.data);
    });
  }, [userDataUpdated]);

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
