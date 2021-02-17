import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { Formik, Field, Form } from 'formik';
import { token, getAssignments } from '../canvasCalls';
import styles from './styles/selectAssignmentForm.module.scss';

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
    //       console.log('Fetching Assignments...')
    //       const res = await getAssignments(token, 1);
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
            <div className={styles.form}>
                <div className={styles.form__description}>
                    Select your class and assignment to import data from.
                </div>
                <Form>
                    <Field className={styles.form__input} id="courseId" name="courseId" placeholder="Course ID" />
                    <Field className={styles.form__input} id="assignmentId" name="assignmentId" placeholder="Assignment ID" />

                    <button className={styles.form__button} type="submit">Submit</button>
                </Form>
            </div>
        </Formik>
    );
};

export default SelectAssignmentForm;