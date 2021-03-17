import React from "react";
import Container from "../../../components/container";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// submission report mock data
var subData = {
  reviews: [
    [11, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [11, 120, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [12, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [12, 118, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [13, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [13, 119, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [14, 113, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [14, 117, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [15, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [15, 111, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [16, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [16, 118, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [17, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [17, 119, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [18, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [18, 120, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [19, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [19, 116, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [20, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [20, 112, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [1, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [2, 114, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [3, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [1, 112, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [1, 111, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [2, 116, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [3, 113, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }]],
  rubric: [[50, 'Content'], [50, 'Writing Quality']]
}

// review report mock data
var revData = {
  reviews: [
    [11, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [11, 120, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [12, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [12, 118, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [13, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [13, 119, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [14, 113, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [14, 117, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [15, 114, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [15, 111, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [16, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [16, 118, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [17, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [17, 119, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [18, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [18, 120, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [19, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [19, 116, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [20, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [20, 112, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [1, 115, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [2, 114, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [3, 117, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [1, 112, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [1, 111, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }],
    [2, 116, { 'scores': [[0.6, 'okay'], [0.4, 'bad']], 'comments': 'Try harder' }],
    [3, 113, { 'scores': [[0.9, 'good'], [0.8, 'decent']], 'comments': 'Nice Work' }]],
  rubric: [[50, 'Content'], [50, 'Writing Quality']]
}

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
  
  var finalData = [];
  for (let [key,value] of dataMap){
    finalData.push([key, value]);
  }
  return finalData;
}

const ReviewReports = () => {
  var rev = (formatData(revData.reviews));
  return (
    <div className="Content">
      <Container name="Review Reports for Assignment 1" >
        {rev.map(review =>
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
        )}
      </Container>
      <Container name="Submission Reports for Assignment 1" />
    </div>
  );
};

export default ReviewReports;
