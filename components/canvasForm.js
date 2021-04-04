import React from 'react';
import { useFormik } from 'formik';
import Router from 'next/router'
import styles from './styles/canvasForm.module.scss';
import { useUserData } from "./storeAPI";
const axios = require("axios");
const { server } = require("../config/index.js");
const canvasCalls = require("../canvasCalls");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('fake_secret');

const CanvasForm = () => {
  const { userId, courseId, courseName, key, setKey } = useUserData();
  const formik = useFormik({
    initialValues: {
      canvasKey: '',
    },
    onSubmit: values => {
      (async () => {
        let newkey = values.canvasKey;
        setKey(newkey);
        // let encryptedKey = await cryptr.encrypt(newkey);
        // let new_course = {
        //   active: true,
        //   canvasId: courseId,
        //   courseName: courseName,
        //   canvasKey: encryptedKey
        // }
        // console.log('Submitting encrypted key:', encryptedKey);
        // canvasCalls.addCourses([new_course]).then(response => {
        //   console.log(response);
        // });
        Router.push('/canvas/canvasSelect')
      })();
    },
      
    });
  return (
    <div className={styles.form}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.form__description}>
          Input your Canvas API Key to import course data into Peerpal.
        </div>
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