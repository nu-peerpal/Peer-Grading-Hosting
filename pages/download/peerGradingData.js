import React from 'react';
import Container from "../../components/container";
import Link from 'next/link';
import Button from "@material-ui/core/Button";

import { useUserData } from "../../components/storeAPI";

const axios = require("axios");

const download = () => {

  const { context_id } = useUserData();
  //const { readFile, writeFile } = fs.promises;
  console.log(context_id)

  const JSONToCSV = (jsonData) => {
    const data = jsonData.data.data;
    console.log(data);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = [
        header.join(','), // header row first
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    console.log(csv);
    return csv;
  }

  const handleJSONSubmit = () => {
    axios.get(`/api/courseReviews/1`).then(peerGradingData => {
      const fileName = "PeerGradingData";
      const json = JSON.stringify(peerGradingData);
      const blob = new Blob([json],{type:'application/json'});
      const href = URL.createObjectURL(blob); // Create a downloadable link
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".json";
      document.body.appendChild(link);   // This can any part of your website
      link.click();
      document.body.removeChild(link);
    });
  }

  const handleCSVSubmit = () => {
    axios.get(`/api/courseReviews/1`).then(peerGradingData => {
      const fileName = "PeerGradingData";
      const csv = JSONToCSV(peerGradingData);
      const blob = new Blob([csv],{type:'text/csv'});
      const href = URL.createObjectURL(blob); // Create a downloadable link
      const link = document.createElement('a');       
      link.href = href;
      link.download = fileName + ".csv";
      document.body.appendChild(link);   // This can any part of your website
      link.click();
      document.body.removeChild(link);
    });
  }

  return (
    <Container name={"Download Data"}>
        <div>
            <span>Download peer grading data as either JSON or .csv file below</span>
        </div>

        <Link href="#" passHref>
          <Button onClick={handleJSONSubmit} variant="contained" color="primary">
            Download JSON
          </Button>
        </Link>

        <Link href="#" passHref>
          <Button onClick={handleCSVSubmit} variant="contained" color="primary">
            Download .CSV
          </Button>
        </Link>

    </Container>
  );
};

export default download;


