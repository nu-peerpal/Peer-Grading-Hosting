import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import ListContainer from "./listcontainer";
import { Formik, Field, Form } from 'formik';
import { token, getAssignments } from '../canvasCalls';
import styles from './styles/selectAssignmentForm.module.scss';
import { useUserData } from "./storeAPI";
const canvasCalls = require("../canvasCalls");
const axios = require("axios");


const SelectAssignmentForm = (props) => {
    const { userId, courseId, courseName, key } = useUserData();
    const taUserId = 1;
    const [assignments, setAssignments] = useState();
    const [eligible, setEligible] = useState([]);
    const [inprog, setInprog] = useState([]);
    const [ineligible, setIneligible] = useState([]);

    useEffect(() => {
      canvasCalls.getAssignments(canvasCalls.token, 1).then(response => {
        setAssignments(response);
        
      });
    }, []); 

    return (
      <div className="Content">
        <ListContainer
          name="Pick an assignment to begin Peer Grading:"
          data={assignments}
          link="/assignments/fullassignmentview/fullassignmentview"
        />
      </div>
    );
};

export default SelectAssignmentForm;