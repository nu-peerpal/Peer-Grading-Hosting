import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import ListContainer from "./listcontainer";
import { Formik, Field, Form } from 'formik';
import { token, getAssignments } from '../canvasCalls';
import styles from './styles/selectAssignmentForm.module.scss';
import cookieCutter from 'cookie-cutter';

const SelectAssignmentForm = () => {
    const taUserId = 1;

    useEffect(() => {
      console.log(cookieCutter.get());
      //   (async () => {
      //     console.log('Fetching Assignments...')
      //     const res = await getAssignments(token, 1);
      //     const result = await res.json()
      //     console.log(result);
      //   })();
      }, [taUserId]); //only run if user Id is changed?
    const eligible = [{ name: "Assignment 1", info: "Completed 2/15/21" }];
    const inprog = [{ name: "Assignment 2", info: "Due 3/1/21" }];
    const ineligible = [{ name: "Assignment 3", info: "No Submission Data" }];
    return (
      <div className="Content">
        Select an assignment to begin Peer Grading:
        <ListContainer
          name="Eligible Assignments"
          data={eligible}
          link="/assignments/fullassignmentview/fullassignmentview"
        />
        <ListContainer
          name="In Progress Assignments"
          data={inprog}
          link="/assignments/fullassignmentview/fullassignmentview"
        />
        <ListContainer
          name="Ineligible Assignments"
          data={ineligible}
          link="/assignments/fullassignmentview/fullassignmentview"
        />
      </div>
    );
};

export default SelectAssignmentForm;