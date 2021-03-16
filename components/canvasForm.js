import React from 'react';
import { useFormik } from 'formik';
import Router from 'next/router'
var bcrypt = require('bcryptjs');
import styles from './styles/canvasForm.module.scss';
import { useUserData } from "./storeAPI";


const CanvasForm = () => {
  const { userId, courseId } = useUserData();
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {
      canvasKey: '',
    },
    onSubmit: values => {
      var key = values.canvasKey;
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(key, salt);

      (async () => {
          console.log('Submitting hashed key:', hash);
          const res = await fetch(
          `/api/courses`,
          {
              body: JSON.stringify({
                active: true,
                canvasId: courseId,
                courseName: 'Any name',
                canvasKey: hash
              }),
              headers: {
              'Content-Type': 'application/json'
              },
              method: 'POST'
          });
          const result = await res.json()
          console.log(result);
      })();
      Router.push('/canvas/canvasSelect')
      },
    });
  return (
    <div className={styles.form}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.form__description}>
          Input your Canvas API Key to import course data into Peerpal.
        </div>
        {/* <label htmlFor="canvasKey">Canvas API Key</label> */}
        <input
          className={styles.form__input}
          id="canvasKey"
          name="canvasKey"
          placeholder="Canvas API Key"
          onChange={formik.handleChange}
          value={formik.values.canvasKey}
        />

        <button className={styles.form__button} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CanvasForm;