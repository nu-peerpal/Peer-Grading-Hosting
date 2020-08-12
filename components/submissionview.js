import React from "react";
import styles from "./styles/submissionview.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Field, Formik, Form } from "Formik";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // :[
      //   {'name': '', 'info':""},
      //   {'name': '', 'info':""},
      // ],
    }
  }
  render() {
    return (
      <div className={styles.sub}>
        <Accordion className={styles.acc}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            User 1's Submission
                    </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <br />
        <Grading />
      </div>
    )
  }
}

export default Submission;


function createRow(desc) {
  return { desc };
}

const rows = [
  createRow('Answer/Algorithm'),
  createRow('Proof Analysis'),
  createRow('Clarity'),
];

function Grading() {
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
            <TableContainer component={Paper}>
              <Table aria-label="spanning table">
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell align="center">Grade</TableCell>
                    <TableCell align="center">Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.desc}>
                      <TableCell>{row.desc}</TableCell>
                      <TableCell align="center">
                        <Field
                          name="PeerLoad"
                          type="input"
                          value={values.PeerLoad}
                          id="outlined-basic"
                          variant="outlined"
                          required={true}
                          as={TextField}
                          className={styles.pms}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Field
                          name="GraderLoad"
                          type="input"
                          value={values.GraderLoad}
                          id="outlined-basic"
                          variant="outlined"
                          required={true}
                          as={TextField}
                          className={styles.pms}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <Button className={styles.save} disabled={isSubmitting} type="submit">Save</Button>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Form>
        )
      }
    </Formik >
  )
}