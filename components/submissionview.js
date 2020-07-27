import React from "react";
import styles from "./styles/submissionview.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
        //   const = this.state
        return (
          <div className={styles.sub}>
                  <Accordion className={styles.acc}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    </AccordionSummary>
                    <AccordionDetails>
                    </AccordionDetails>
                  </Accordion>
          </div>
        )
      }
    }
    
    export default Submission;