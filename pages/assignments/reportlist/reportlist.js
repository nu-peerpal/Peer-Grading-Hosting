import React, { useState, useEffect } from "react";
import Container from "../../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import styles from './reviewreportlist.module.scss';
import subData from "../../../sample_data/submissionReports";
import revData from "../../../sample_data/reviewReports";
import { submissionReports, reviewReports } from "../../api/AlgCalls.js";
import { useUserData } from "../../../components/storeAPI";
import { useRouter } from 'next/router'
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')
const canvasCalls = require("../../../canvasCalls");


const ReviewReports = () => {
  const router = useRouter()
  const { userId, courseId, courseName, assignment, key, setKey } = useUserData();
  const [needsLoading, setNeedsLoading] = useState(true);
  const [subReports, setSubReports] = useState([]);
  const [revReports, setRevReports] = useState([]);
  const { assignmentId, assignmentName } = router.query;

  function generateReports() {
    Promise.all([submissionReports(subData.graders,subData.reviews,subData.rubric),reviewReports(revData.graders,revData.reviews,revData.rubric),canvasCalls.getUsers(canvasCalls.token,courseId)])
    .then(reports => {
      console.log('reports',reports);
      setSubReports(reports[0][1]);
      // Change User ID to User Name for Review Reports
      let users = reports[2];
      for (let revRep in reports[1][1]) {
        let i = users.findIndex(x => x.canvasId == reports[1][1][revRep][0])
        reports[1][1][revRep][0] = users[i]["firstName"] + " "+ users[i]["lastName"];
      }
      setRevReports(reports[1][1]);
      setNeedsLoading(false);

    });
  }
  useEffect(() => {
    // console.log(reports);
    // submissionReports(subData.graders,subData.reviews,subData.rubric)
  },[])

  return (
    <div className="Content"> 
      {needsLoading ? 
        <Container name={"Generate Reports"}>
          <Button onClick={() => generateReports()}>Generate Reports</Button>
        </Container>
      :
        <div>
        <Container name={"Submission Reports for " + assignmentName} >
          {
            subReports.map(sub =>
              <Accordion key={sub[0]}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Submission {sub[0]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                      <ReactMarkdown plugins={[gfm]} children={sub[1]} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        <Container name={"Review Reports for " + assignmentName}>
        {
            revReports.map(rev =>
              <Accordion key={rev[0]+rev[1]}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >{rev[0]}: submission {rev[1]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                      <ReactMarkdown plugins={[gfm]} children={rev[2]} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        </div>
      }
    </div>
  );
};

export default ReviewReports;
