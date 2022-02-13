import React, { useEffect, useState } from 'react';
import Container from "../../components/container";
import Link from 'next/link';
import Button from "@material-ui/core/Button";
import Router from "next/router";
import downloadStyles from "./download.module.scss";
import containerStyles from "../../components/styles/container.module.scss";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';

import { useUserData } from "../../components/storeAPI";
// import Cookies from 'js-cookie';

const axios = require("axios");

const download = (props) => {

  const [currentUserId, setCurrentUserId] = useState('');
  const [canvasUsers, setCanvasUsers] = useState()
  const [ peerGradingData, setPeerGradingData ] = useState()

  const { courseId } = useUserData();
  const review_tooltip = "Reviews and scores given by peers. Presented as a JSON object"
  const reviewReview_tooltip = "Reviews and scores given by TA's. Presented as a JSON object"
  const assignmentId_tooltip = "ID of the assignment"
  const userId_tooltip = "ID of the user"
  const submissionId_tooltip = "ID of the submission"
  const matchingType_tooltip = "The stage where the review was matched. Either 'initial', 'additional', or 'TA'"

  // useEffect(() => {
  //   if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
  //     console.log('creating user data');
  //     const userData = JSON.parse(Cookies.get('userData'));
  //     console.log({userData});
  //   }
  // }, []);

  useEffect(() => {

    // do not render if courseId is null
    if (!courseId) {
      console.log("waiting for courseId");
      return;
    }

    // get peer grading data
    axios.get(`/api/courseReviews/${courseId}`).then(res => {
      setPeerGradingData(res)
    });

    // get list of (student) canvas users from which to filter
    axios.get(`/api/canvas/users?courseId=${courseId}`).then(res => {
      
      const users = res.data.data
        .filter(({enrollment}) => ["StudentEnrollment"].includes(enrollment))
        .map(u => ({
          name: `${u.firstName} ${u.lastName}` ,
          id: u.canvasId
      }));

      setCanvasUsers(users)
    });

  }, [courseId, currentUserId]);

  /* HELPER FUNCTIONS */
  const JSONToCSV = (jsonData) => {
    const data = jsonData;
    console.log(data);
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(jsonData[0]);
    const csv = [
        header.join(','), // header row first
        ...jsonData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    console.log(csv);
    return csv;
  }

  const filterByUser = (data, userId) => {
    if (userId !== '') {
      return data.filter(review => review.userId === userId)
    }

    return data
  }

  /* HANDLE BUTTON CLICKS */
  const handleJSONSubmit = () => {
      const fileName = "PeerGradingData";

      // obtain reviews and filter by user if specified
      let reviews = peerGradingData.data.data
      console.log(peerGradingData.data.data)
      reviews = filterByUser(reviews, currentUserId);

      // creates a downloadable JSON file
      const json = JSON.stringify(reviews);
      const blob = new Blob([json],{type:'application/json'});
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".json";

      // temporary HTML element to add the download JSON link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const handleCSVSubmit = () => {
      const fileName = "PeerGradingData";

      // obtain reviews and filter by user if specified
      let reviews = peerGradingData.data.data;
      reviews = filterByUser(reviews, currentUserId);

      // convert to JSON to CSV
      const csv = JSONToCSV(reviews);

      //creates a downloadable CSV file
      const blob = new Blob([csv],{type:'text/csv'});
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".csv";

      // temporary HTML element to add the download CSV link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  /* Change state when user input is modified */
  const handleUserChange = (event) => {
    setCurrentUserId(event.target.value);
  }

  // can easily switch line 86 to Container
  return (
    <div className={downloadStyles.containers}>
      <KeyboardBackspaceIcon className={containerStyles.back} onClick={() => Router.back()} />

      <h1><span>Download Peer Grading Data</span></h1>
      
      <div className={downloadStyles.buttonContainer}>
        <div className={downloadStyles.button}>
        
            <Link href="#" passHref>
              <Button onClick={handleJSONSubmit} 
                      variant="contained" 
                      color="primary"
                      disabled={!peerGradingData}>
                Download JSON
              </Button>
            </Link>

        </div>
        <div className={downloadStyles.button}>

            <Link href="#" passHref>
              <Button onClick={handleCSVSubmit} 
                      variant="contained" 
                      color="primary" 
                      disabled={!peerGradingData}>
                Download CSV
              </Button>
            </Link>

        </div>
      </div>

      <h1><span>Filter Data by User</span></h1>

      {canvasUsers 
      ?
        <div className={downloadStyles.filterContainer}>
          <FormControl variant="outlined" className = {downloadStyles.formControl} style={{marginLeft: '15px'}}>
              <InputLabel >Student</InputLabel>
              <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  style={{ width: '200px'}}
                  value={currentUserId}
                  onChange={handleUserChange}
                  label="UserID"
              >
                {canvasUsers.map(student =>
                    <MenuItem key={JSON.stringify(student)} value={student.id}>{student.name}</MenuItem>
                )}
              </Select>
          </FormControl>
        </div>
      : 
        <div className={downloadStyles.filterContainer}></div>
      }
      
      <div className={downloadStyles.buttonContainer}>
        <div className={downloadStyles.button}>
        
            <Link href="#" passHref>
              <Button onClick={handleJSONSubmit} 
                      variant="contained" 
                      color="primary"
                      disabled={!peerGradingData}>
                Download Filtered JSON
              </Button>
            </Link>

        </div>
        <div className={downloadStyles.button}>

            <Link href="#" passHref>
              <Button onClick={handleCSVSubmit} 
                      variant="contained" 
                      color="primary" 
                      disabled={!peerGradingData}>
                Download Filtered CSV
              </Button>
            </Link>

        </div>
      </div>

      {!peerGradingData 
        ? <div className={downloadStyles.infoContainer}>
            <h3>ERROR: CANNOT RETRIEVE DATA</h3>
            <h5>(Please navigate back to 'Home' and try again)</h5>
          </div>
        : <div className={downloadStyles.infoContainer}>
            <h2>Data Categories</h2>
            <ul>
              <li>review<span className={downloadStyles.tooltipText}>{review_tooltip}</span></li>
              <li>reviewReview<span className={downloadStyles.tooltipText}>{reviewReview_tooltip}</span></li>
              <li>assignmentId<span className={downloadStyles.tooltipText}>{assignmentId_tooltip}</span></li>
              <li>userId<span className={downloadStyles.tooltipText}>{userId_tooltip}</span></li>
              <li>submissionId<span className={downloadStyles.tooltipText}>{submissionId_tooltip}</span></li>
              <li>matchingType<span className={downloadStyles.tooltipText}>{matchingType_tooltip}</span></li>
            </ul>
          </div>
        }

    </div>
  );
};

export default download;


