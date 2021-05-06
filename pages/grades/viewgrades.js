import React, { useState, useEffect } from "react";
import Container from "../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import styles from './grades.module.scss';
import StudentViewOutline from '../../components/studentViewOutline';
import { useUserData } from "../../components/storeAPI";
import { useRouter } from 'next/router';
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')
const axios = require("axios");

function ViewAssignmentGrade(props) {
    const router = useRouter();
    const { userId, courseId } = useUserData();
    const [subReports, setSubReports] = useState([]);
    const [revReports, setRevReports] = useState([]);
    const [loadSRSubmission, setLoadSRSubmission] = useState();
    const [loadRRSubmission, setLoadRRSubmission] = useState();
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);
  let { id, name } = router.query;
  console.log({userId})

  useEffect(() => {
      Promise.all([axios.get(`/api/canvas/submissions?courseId=${courseId}&assignmentId=${id}`),axios.get(`/api/submissions?assignmentId=${id}`),axios.get(`/api/reviewGradesReports?userId=${userId}&assignmentId=${id}`)]).then(data => {
        let canvasSubmissionsRes = data[0].data.data;
        let submissionsRes = data[1].data.data;
        let reviewReportsRes = data[2].data.data;
        console.log({data})
        // let subId = reviewReportsRes[0].grade; // submission id is stored in "grade". fix this later.
        // find which group users are in
        let groupSub = canvasSubmissionsRes.filter(x => x.submitterId == userId);
        let group = groupSub[0].groupId;
        if (group == null) group = groupSub[0].submitterId; // if null group, use userId 
        let userSubmissions = submissionsRes.filter(x => (x.groupId == group && x.assignmentId == id));
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

  }, []);

  function getGrade(report) {
    if (report.includes("(Ungraded)")) {
      return "Ungraded";
    } else {
      let numbers = report.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;});
      return numbers[0]; // return first number from report
    }
  }

  return (
    <div className="Content">
      <Container name={"Submission Reports for " + name} >
          {
            subReports.map((sub,index) =>
              <Accordion key={JSON.stringify(sub)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                <Typography >Submission {index + 1}. Grade: {getGrade(sub.report)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    {index === loadSRSubmission ? 
                      sub.s3Link.includes('http') ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={sub.s3Link}></iframe> : <Typography>{sub.s3Link}</Typography>
                      :
                        <Button onClick={() => setLoadSRSubmission(index)}>Load Submission</Button>
                      }
                    
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
                <Typography >Peer Review {index + 1}. Grade: {getGrade(rev.report)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={styles.details}>
                    {index === loadRRSubmission ? 
                      rev.s3Link.includes('http') ? <iframe style={{ width:"100%",height:"100%",minHeight:"80vh"}} src={rev.s3Link}></iframe> : <Typography>{rev.s3Link}</Typography>
                      :
                        <Button onClick={() => setLoadRRSubmission(index)}>Load Submission</Button>
                      }
                    
                      <ReactMarkdown plugins={[gfm]} children={rev.report} />
                    </div>
                </AccordionDetails>
              </Accordion>
            )
          }
        </Container>
      <StudentViewOutline SetIsStudent={props.SetIsStudent}/>
    </div>
  );
}

export default ViewAssignmentGrade;
