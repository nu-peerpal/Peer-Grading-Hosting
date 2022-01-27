import React, { useEffect, useState } from 'react';
import Container from "../../components/container";
import Link from 'next/link';
import Button from "@material-ui/core/Button";
import Router from "next/router";
import downloadStyles from "./download.module.scss";
import containerStyles from "../../components/styles/container.module.scss";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { useUserData } from "../../components/storeAPI";
// import Cookies from 'js-cookie';

const axios = require("axios");

const download = () => {

  const { courseId } = useUserData();
  const [ peerGradingData, setPeerGradingData ] = useState()
  const tooltip = "Example tooltip to demonstrate how this feature would work"

  // useEffect(() => {
  //   if (Cookies.get('userData') && !savedStudentId) { // create new user if not viewing as student and cookie is set
  //     console.log('creating user data');
  //     const userData = JSON.parse(Cookies.get('userData'));
  //     console.log({userData});
  //   }
  // }, []);

  useEffect(() => {
    if (!courseId) {
      console.log("waiting for courseId");
      return;
    }

    axios.get(`/api/courseReviews/${courseId}`).then(data => {
      setPeerGradingData(data)
    });
  }, [courseId]);

  console.log(peerGradingData)

  const JSONToCSV = (jsonData) => {
    const data = jsonData.data.data;
    console.log(data);
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csv = [
        header.join(','), // header row first
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    console.log(csv);
    return csv;
  }

  const handleJSONSubmit = () => {
      const fileName = "PeerGradingData";
      console.log(peerGradingData.data.data)
      const json = JSON.stringify(peerGradingData.data.data);
      const blob = new Blob([json],{type:'application/json'});
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const handleCSVSubmit = () => {
      const fileName = "PeerGradingData";
      const csv = JSONToCSV(peerGradingData);
      const blob = new Blob([csv],{type:'text/csv'});
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      {!peerGradingData 
        ? <div className={downloadStyles.infoContainer}>
            <h3>ERROR: CANNOT RETRIEVE DATA</h3>
            <h5>(Please navigate back to 'Home' and try again)</h5>
          </div>
        : <div className={downloadStyles.infoContainer}>
            <h2>Data Categories</h2>
            <ul>
              <li>review<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
              <li>reviewReview<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
              <li>assignmentId<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
              <li>userId<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
              <li>submissionId<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
              <li>matchingType<span className={downloadStyles.tooltipText}>{tooltip}</span></li>
            </ul>
          </div>
        }

    </div>
  );
};

export default download;


