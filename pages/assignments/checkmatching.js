
import React from "react";
import styles from "./checkmatching.module.css";
import Container from '../../components/container'
import Tree from '../../components/tree'
import AutoComplete from '../../components/autocomplete'
import { Field, Formik, Form } from "Formik";
import Button from '@material-ui/core/Button'


class CheckMatching extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
    //const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
  return(
      <Container>
        <Algorithm/>
        <Tree response={ds} />
      </Container>
    )
  }
}

export default CheckMatching;

function Algorithm() {
  return (
    <Formik
      initialValues={{TA: [] }}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        console.log(data)
        setSubmitting(false);
      }}>
      {({ values, isSubmitting }) =>
        (
          <Form className={styles.pms}>
            <Field
              name='TA'
              component={AutoComplete}
              className={styles.child}
              // as={Autocomplete}
              required={true}
              // value={values.TA}
              label="TA"
            />
            <Button disabled={isSubmitting} type="submit">Save</Button>
            <Button>Recompute Matching</Button>
            <Button>Clear</Button>
          </Form>
        )}
    </Formik>
  )
}
