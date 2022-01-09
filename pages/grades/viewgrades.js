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
    const [eligibleAppeal, setEligibleAppeal] = useState();
    const [appealReview, setAppealReview] = useState({});
    const [appealAvailable, setAppealAvailable] = useState(false);
    const [appealButtonText, setAppealButtonText] = useState("Appeal Not Loaded");
    const [appealFormat, setAppealFormat] = useState({});
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);
  let { id, name } = router.query;

  useEffect(() => {
      Promise.all([axios.get(`/api/submissions?assignmentId=${id}`),
        axios.get(`/api/reviewGradesReports?userId=${userId}&assignmentId=${id}`),
        axios.get(`/api/assignments/${id}`),
        axios.get(`/api/peerReviews?assignmentId=${id}`),
        axios.get(`/api/groupEnrollments?assignmentId=${id}&userId=${userId}`)]).then(data => {
        let submissionsRes = data[0].data.data;
        let reviewReportsRes = data[1].data.data;
        let assignmentRes = data[2].data.data;
        let peerReviews = data[3].data.data;
        let groupData = data[4].data.data;
        console.log({data})
        // let subId = reviewReportsRes[0].grade; // submission id is stored in "grade". fix this later.
        // find which group users are in
        let userSubmissions;
        if (groupSub[0]) { // only if student actually submitted assignment
          let group = groupSub[0].groupId;
          if (group == null) group = groupSub[0].submitterId; // if null group, use userId
          userSubmissions = submissionsRes.filter(x => (x.groupId == group && x.assignmentId == id));
          if (userSubmissions.length > 1) console.log('student has more than one submission for assignment.')
          if (!userSubmissions[0].report.includes('TA Review 1')) setEligibleAppeal(true); // if no TA review, eligible for appeal

          // check for existing appeal or if appeal deadline has passed
          if (assignmentRes.appealsDueDate) {
            let today = new Date();
            let dueDate = new Date(assignmentRes.appealsDueDate);
            if (today < dueDate) {
              let appealReviews = peerReviews.filter(pr => (pr.submissionId == userSubmissions[0].canvasId && pr.matchingType == "appeal"));
              if (appealReviews.length > 0) { // if appeal already exists
                setAppealAvailable(false);
                setAppealButtonText('Appeal Submitted');
                setAppealReview(appealReviews[0]); // assuming one appeal
              } else {
                let TAreviews = peerReviews.filter(pr => pr.matchingType == "TA");
                let TAId = TAreviews[0].userId;
                let appeal = {
                  review: null,
                  reviewReview: null,
                  matchingType: 'appeal',
                  assignmentId: id,
                  assignmentSubmissionId: null,
                  userId: TAId,
                  submissionId: userSubmissions[0].canvasId
                }
                console.log({appeal})
                setAppealFormat(appeal);
                setAppealAvailable(true);
                setAppealButtonText("Submit Appeal")
              }
            } else {
              setAppealAvailable(false);
              setAppealButtonText("Appeals Deadline passed")
            }
          } else {
            setAppealAvailable(false);
            setAppealButtonText("Appeals not set for assignment yet")
          }
        } else { // no submission available, skip steps
          userSubmissions = [];
        }
        console.log({reviewReportRes});
        console.log({submissionRes});
        reviewReportsRes.sort(function(a, b){return a.id-b.id});
        reviewReportsRes.forEach((report,i) => {
            let reportSubmission = submissionsRes.filter(x => x.canvasId == report.grade)
            console.log({reportSubmission})
            reviewReportsRes[i].s3Link = reportSubmission[0].s3Link;
        })
        console.log({reviewReportsRes})
        setSubmissions(submissionsRes);
        setSubReports(userSubmissions);
        setRevReports(reviewReportsRes);
      }).catch(err => console.log({err}));

  }, []);

  function getGrade(report) {
    if (report.includes("(Ungraded)")) {
      return "Ungraded";
    } else {
      let numbers = report.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;});
      return numbers[0]; // return first number from report
    }
  }

  async function handleAppeal() {
    console.log('handling appeal');

    // Notify TA when new appeals are assigned

     Promise.all([
          axios.post(`/api/peerReviews?type=multiple`,[appealFormat]),
          axios.post(`/api/sendemail?&type=appeals&courseId=${courseId}`, {
            userId: appealFormat.userId,
            subject: 'Assigned Appeal',
            message: `New appeal for ${name} has been assigned.`
          })
        ]).then(res => {console.log('res:',res)
            if (res[0].status == 201) {
              setAppealAvailable(false);
              setAppealButtonText('Appeal Submitted');
            } else {
              setAppealButtonText('Something Went Wrong. Try again');
            }
            }).catch(err => console.log('err:',err))

  }
  async function removeAppeal() {
    console.log('removing appeal');
    // console.log({appealReview})
    let res = await axios.delete(`/api/peerReviews/${appealReview.id}`);
    if (res.status == 200) {
      setAppealAvailable(true);
      setAppealButtonText("Submit Appeal");
    } else {
      setAppealButtonText('Something Went Wrong. Try again');
    }
    console.log({res})
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
                      <br />
                      <br />
                      {eligibleAppeal ? <div className={styles.disclaimer}>
                        <div>This submission is eligible for appeal. If you submit an appeal,
                        you will lose the 5% bonus added to your current score and receive a TA grade instead.</div>
                      <br />
                      <span><b>Note:</b> submitting an appeal applies to all members in your group.</span>
                      <div>
                        <Button disabled={!appealAvailable} onClick={handleAppeal}>{appealButtonText}</Button>
                        {appealReview && <Button onClick={removeAppeal}>Cancel</Button>}
                      </div>
                      </div> : <div>
                        <span className={styles.disclaimer}>This submission is not eligible for appeal
                        because you have already received a TA grade. If you would like to submit a regrade request,
                        see Canvas for more information on how to do that.
                        </span>
                      </div>}

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
