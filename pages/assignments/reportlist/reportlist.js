import React, { useState, useEffect } from "react";
import Container from "../../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './reviewreportlist.module.scss';
import subData from "../../../sample_data/submissionReports";
import revData from "../../../sample_data/reviewReports";
import { submissionReports } from "../../api/AlgCalls.js";
const ReactMarkdown = require('react-markdown');
const gfm = require('remark-gfm')


function formatData(data) {
  var dataMap = new Map();

  for (var review of data) {
    // clarifying each representation
    var user_id = review[0];
    var submission_id = review[1];
    var review_obj = review[2];

    // if we haven't seen the user_id yet
    if (!dataMap.has(user_id)) {
      //add that user_id + array with submission_id and scores object
      dataMap.set(user_id, [[submission_id, review_obj]])
    }

    // if we have seen the user_id
    else {
      var temp = dataMap.get(user_id);
      temp.push([submission_id, review_obj]);
      dataMap.set(user_id, temp)
    }
  }

  // console.log(dataMap)
  // var finalData = [];
  // for (let [key, value] of dataMap) {
  //   finalData.push([key, value]);
  // }
  return dataMap;
}

function FormatSection(data) {
  var section = [];
  for (var review of data) {
    section.push(
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography >User ID: {review[0]}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {review[1]}
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  }
  return section;
}

const ReviewReports = () => {
  const [subReports, setSubReports] = useState([]);

  useEffect(() => {
    submissionReports(
      subData.graders,
      subData.reviews,
      subData.rubric
    ).then(reports => {
      console.log('reports',reports);
      setSubReports(reports[1]);
    });
    // console.log(reports);
    // submissionReports(subData.graders,subData.reviews,subData.rubric)
  },[])
  
  // var rev = (formatData(revData.reviews));
  // console.log(rev)
  // var keys = [...rev.keys()];
  // console.log(rev.get(keys[0]))
  return (
    <div className="Content">
      <Container name="Review Reports for Assignment 1" >
        {
          subReports.map(sub =>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography >User ID: {sub[0]}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className={styles.details}>
                    <ReactMarkdown plugins={[gfm]} children={sub[1]} />
                  </div>
                  {/* <div className={styles.details}>
                    <div className={styles.submissionContainer}>
                    {
                      rev.get(user_id).map(submission =>
                        <div className={styles.submission}>
                          <div className={styles.submission__title}>Submission #: {submission[0]}</div>
                          <div className={styles.submission__body}>
                            <div className={styles.scoreContainer}>
                              {submission[1].scores.map(score =>
                                <div className={styles.score}>
                                  <p className={styles.score__rubric_field}>{revData.rubric[submission[1].scores.indexOf(score)][1]}</p>
                                  <p className={styles.score__value}>{score[0]}</p>
                                  <p className={styles.score__title}>{score[1]}</p>
                                </div>
                              )}
                            </div>
                            <div>
                                <p className={styles.details__title}>Comments</p>
                                {submission[1].comments}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    </div> */}
                    {/* <p className={styles.details__title}>Scores</p>
                    <div className={styles.scoreContainer}>
                      {review[2].scores.map(score =>
                        <div className={styles.score}>
                          <p className={styles.score__value}>{score[0]}</p>
                          <p className={styles.score__title}>{score[1]}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={styles.details__title}>Comments</p>
                      {review[2].comments}
                    </div> */}
                  {/* </div> */}

                </Typography>
              </AccordionDetails>
            </Accordion>

          )
        }
        {/* {
          revData.reviews.map(review =>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography >User ID: {review[0]}, Submission ID: {review[1]}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className={styles.details}>
                    <div>
                      <p className={styles.details__title}>Scores</p>
                      <div className={styles.scoreContainer}>
                        {review[2].scores.map(score =>
                          <div className={styles.score}>
                            <p className={styles.score__value}>{score[0]}</p>
                            <p className={styles.score__title}>{score[1]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className={styles.details__title}>Comments</p>
                      {review[2].comments}
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>

          )
        } */}
      </Container>
      <Container name="Submission Reports for Assignment 1" />
    </div>
  );
};

export default ReviewReports;
