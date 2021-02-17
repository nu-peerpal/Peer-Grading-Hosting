import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { Formik, Field, Form } from 'formik';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getAssignments } from '../../canvasCalls';

const SelectAssignmentForm = () => {
    const taUserId = 1;
    const [courseId, setCourseId] = useState();
    const [assignmentId, setAssignmentId] = useState();

    const handleAssignmentChange = (event) => {
        setAssignmentId(event.target.value);
    };
    const handleCourseChange = (event) => {
        setCourseId(event.target.value);
    };
    // useEffect(() => {
    //     (async () => {
    //       console.log('Fetching courses...')
    //       const res = await getCourses();
    //       const result = await res.json()
    //       console.log(result);
    //     })();
    //   }, [taUserId]); //only run if user Id is changed?

    return (
        <Formik
        initialValues={{
            assignmentId: '',
            courseId: '',
        }}
        onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));
            alert(JSON.stringify(values, null, 2));
            Router.push("/assignments/fullassignmentview/fullassignmentview")
        }}
        >
        <Form>
            <label htmlFor="courseId">Select Course</label>
            <Select
                labelId="demo-simple-select-filled-label"
                id="courseId"
                value={courseId}
                onChange={handleCourseChange}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>

            <label htmlFor="assignmentId">Select Assignment</label>
            <Select
                labelId="demo-simple-select-filled-label"
                id="assignmentId"
                value={assignmentId}
                onChange={handleAssignmentChange}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>



            <button type="submit">Submit</button>
        </Form>
        </Formik>
    );
};

export default SelectAssignmentForm;