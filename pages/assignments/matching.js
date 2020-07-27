import React from "react";
import styles from "./matching.module.css";
import Container from '../../components/container'
import Tree from '../../components/tree'
import TextField from '@material-ui/core/TextField';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { Field, Formik, Form } from "Formik";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from '@material-ui/core/Button'
import AutoComplete from '../../components/autocomplete'


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


class Matching extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
    //const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
  return(
      <div className = "Content" >
      <Container>
        <Accordion className={styles.matching}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Settings
            </AccordionSummary>
          <AccordionDetails>
            <Settings />
          </AccordionDetails>
        </Accordion>
        <Tree response={ds} />
      </Container>
      </div>
    )
  }
}

export default Matching;

function Settings() {
  return (
    <Formik
      initialValues={{ PeerLoad: '', GraderLoad: '', TA: [] }}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        console.log(data)
        setSubmitting(false);
      }}>
      {({ values, isSubmitting }) =>
        (
          <Form>
            <Field
              name="PeerLoad"
              type="input"
              value={values.PeerLoad}
              id="outlined-basic"
              label="Peer Load"
              variant="outlined"
              required={true}
              as={TextField}
              className={styles.pms}
            />
            <Field
              name="GraderLoad"
              type="input"
              value={values.GraderLoad}
              id="outlined-basic"
              label="Grader Load"
              variant="outlined"
              required={true}
              as={TextField}
              className={styles.pms}
            />
            <Field
              name='TA'
              className={styles.pms}
              component={AutoComplete}
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