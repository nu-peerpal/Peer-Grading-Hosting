import React, {useEffect, useState} from "react";
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
import { useRouter } from 'next/router';
import { useUserData } from "../../../components/storeAPI";
import StudentViewOutline from '../../../components/studentViewOutline';
const axios = require("axios");

const fetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

const FullAssignment = (props) => {
  const { userId, courseId, courseName, assignment } = useUserData();
  const router = useRouter()

  if (!router) {
    console.log("no router");
    return null;
  }

  return (
    <div className="Content">
      <Container name={"Assignment Details: " + router.query.name}>
        <div className={styles.view}>
          {/* <div className={styles.att}>
            <Attributes assignmentName={router.query.name} assignmentId={router.query.id}/>
          </div>
          <Accordion className={styles.inf}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FullDetails />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion> */}
          <div className={styles.check}>
            <Checklist assignmentName={router.query.name} assignmentId={router.query.id} rubricId={router.query.rubricId} dueDate={router.query.dueDate} />
          </div>
        </div>
        <StudentViewOutline isStudent={props.ISstudent} SetIsStudent={props.SetIsStudent} />
      </Container>
    </div>
  );
};

export default FullAssignment;
