import React from "react";
import styles from "./matching.module.css";
import Container from "../../components/container";
import Tree from "../../components/tree";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { Field, Formik, Form } from "formik";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from '@material-ui/core/Button'
import Pray from '../../components/autocomplete'
import { peerMatch } from "../api/AlgCalls.js";


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class Matching extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.Settings = this.Settings.bind(this);
  }

  Settings = function () {
    return (
      <Formik initialValues={{ PeerLoad: 0, GraderLoad: 0, TA: [] }}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          peerMatch(js.graders, js.peers, js.submissions, Number(data.PeerLoad), Number(data.GraderLoad))
          .then(data => {
            this.setState({ 'matching': data })
          });
          setSubmitting(false);
        }}>
          
        {({ values, isSubmitting }) =>
          (
            <Form>
              <Field name="PeerLoad" type="input" value={values.PeerLoad} id="outlined-basic" label="Peer Load" variant="outlined" 
              required={true} as={TextField} className={styles.pms}/>
              <Field name="GraderLoad" type="input" value={values.GraderLoad} id="outlined-basic" label="Grader Load" variant="outlined"
                required={true} as={TextField} className={styles.pms}/>
              <Field name='TA' className={styles.pms} component={Pray}
                required={true} label="TA"/>
              <Button disabled={isSubmitting} type="submit">Save</Button>
              <Button>Recompute Matching</Button>
              <Button>Clear</Button>
            </Form>
          )
        }
      </Formik>
    )
  }

  render() {
    return (
      <div className="Content" >
        <Container name="Peer Matching">
          <Accordion className={styles.matching}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Settings
          </AccordionSummary>
            <AccordionDetails>
              {this.Settings()}
            </AccordionDetails>
          </Accordion>
          <Tree id="tree" response={this.state.matching || ''} />
        </Container>
      </div>
    );
  }
}

export default Matching;

var js = {
  "graders": [1, 2, 3],
  "peers": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  "submissions": [[11, 111], [12, 112], [13, 113], [14, 114], [15, 115], [16, 116], [17, 117], [18, 118], [19, 119], [20, 120]],
  "peer_load": 2,
  "grader_load": 3
}


