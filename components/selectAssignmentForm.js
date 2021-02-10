import React, { useEffect } from 'react';
import Router from 'next/router';
import { Formik, Field, Form } from 'formik';
import { getCourses } from '../canvas';

const SelectAssignmentForm = () => {
    const taUserId = 1;

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
            <Field id="courseId" name="courseId" placeholder="Course ID" />

            <label htmlFor="assignmentId">Select Assignment</label>
            <Field id="assignmentId" name="assignmentId" placeholder="Assignment ID" />


            <button type="submit">Submit</button>
        </Form>
        </Formik>
    );
};

export default SelectAssignmentForm;