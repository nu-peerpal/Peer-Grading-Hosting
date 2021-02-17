import React from 'react';
import { useFormik } from 'formik';
import Router from 'next/router'
var bcrypt = require('bcryptjs');

const CanvasForm = () => {
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

        // (async () => {
        //     console.log('Submitting hashed key:', hash);
        //     const res = await fetch(
        //     `/api/users/${1}`,
        //     {
        //         body: JSON.stringify({
        //         canvasKey: hash
        //         }),
        //         headers: {
        //         'Content-Type': 'application/json'
        //         },
        //         method: 'PATCH'
        //     });
        //     const result = await res.json()
        //     console.log(result);
        // })();
        Router.push('/canvas/canvasSelect')
        },
    });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="canvasKey">Canvas API Key</label>
     <input
        id="canvasKey"
        name="canvasKey"
        onChange={formik.handleChange}
        value={formik.values.canvasKey}
        />

        <button type="submit">Submit</button>
    </form>
    );
};

export default CanvasForm;