import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './grades.module.scss';
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')
const axios = require("axios");

function ViewAssignmentGrade() {
    const router = useRouter();
    const { userId, courseId } = useUserData();
    const [subReports, setSubReports] = useState([]);
    const [revReports, setRevReports] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);
  let { id, name } = router.query;
  console.log({userId})

  useEffect(() => {
      Promise.all([axios.get(`/api/assignments/${id}`),axios.get(`/api/submissions?assignmentId=${id}`),axios.get(`/api/reviewGradesReports?userId=${userId}&assignmentId=${id}`)]).then(data => {
        let assignmentRes = data[0].data.data;
        let submissionsRes = data[1].data.data;
        let reviewReportsRes = data[2].data.data;
        let subId = reviewReportsRes[0].grade; // submission id is stored in "grade". fix this later.
        let userSubmissions = submissionsRes.filter(x => x.canvasId == subId);
        reviewReportsRes.sort(function(a, b){return a.id-b.id});
        reviewReportsRes.forEach((report,i) => {
            let reportSubmission = submissionsRes.filter(x => x.canvasId == report.grade)
            console.log({reportSubmission})
            reviewReportsRes[i].s3Link = reportSubmission[0].s3Link;
        })
        console.log({reviewReportsRes})
        setSubmissions(submissionsRes);
        setSubReports(userSubmissions);
        setRevReports(reviewReportsRes)
      })
    // (async () => {
    //   const [assignmentRes, submissionsRes] = await Promise.all([
    //     fetcher(`/api/assignments/${assignmentId}`),
    //     fetcher(`/api/submissions?assignmentId=${assignmentId}`),
    //   ]);
    //   setAssignment(assignmentRes.data);
    //   setSubmissions(submissionsRes.data);
    // })();
  }, []);

  // Needs work: minor improvements to V0
  return (
    <div className="Content">
      {/* <Container name={`Grade for Assignment ${name}`}>
        <div>Assignment: {name}</div>
        <br />
        {submissions.map(submission => (
          <>
            <div>Grade: {submission.grade}</div>
            <div>Report: {submission.report}</div>
            <br />
          </>
        ))}
      </Container> */}
      <Container name={"Submission Reports for " + name} >
          {
            subReports.map((sub,index) =>
              <Accordion key={JSON.stringify(sub)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Submission {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                
                    <div className={styles.details}>
                    <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={sub.s3Link}/>
                        {/* <div dangerouslySetInnerHTML={{__html: sub.report}}></div> */}
                      <ReactMarkdown plugins={[gfm]} children={sub.report} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
        <Container name={"Review Reports for " + name}>
        {
            revReports.map((rev, index) =>
              <Accordion key={JSON.stringify(rev)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Peer Review {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={rev.s3Link}/>
                      <ReactMarkdown plugins={[gfm]} children={rev.report} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
      <StudentViewOutline/>
    </div>
  );
}

export default ViewAssignmentGrade;
