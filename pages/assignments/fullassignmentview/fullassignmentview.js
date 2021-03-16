import React from "react";
import styles from "./fullassignmentview.module.scss";
import Container from "../../../components/container";
import Attributes from "../../../components/assignmentattributes";
import FullDetails from "../../../components/fullassignmentdetails";
import Checklist from "../../../components/assignmentchecklist";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useSWR from "swr";
import { useRouter } from 'next/router'

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

const FullAssignment = (props) => {
  const router = useRouter()
  // console.log(router.query); //to access assignment data info
  // For future reference:
  // const data = [
  //   {'name': '', 'info':""},
  //   {'name': '', 'info':""},
  // ];
  // console.log('assignment id:', props.id)

  return (
    <div className="Content">
      <Container name={"Assignment Details: " + router.query.name}>
        <div className={styles.view}>
          <div className={styles.att}>
            <Attributes assignmentName={router.query.name} assignmentId={router.query.id}/>
          </div>
          {/* <div className={styles.inf}> */}
          <Accordion className={styles.inf}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FullDetails />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          {/* </div> */}
          <div className={styles.check}>
            <Checklist assignmentName={router.query.name} assignmentId={router.query.id} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FullAssignment;
