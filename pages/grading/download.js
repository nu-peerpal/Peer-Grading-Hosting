import React from 'react';
import Container from "../../components/container";

const download = () => {
  return (
    <Container name={"Download Data"}>
        <div>
            <span>Download peer grading data as either JSON or .csv file below</span>
        </div>
        <button>JSON</button>
        <button>.csv</button>
    </Container>
  );
};

export default download;


