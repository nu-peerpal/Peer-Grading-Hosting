import React from "react";
import "./tagrading.module.css";
import Container from "../../components/container";
import TAsubmission from "../../components/TAgradingview";

const TAGrading = () => {
  return (
    <div className='Content'>
      <Container name='TA Grading'>
        <TAsubmission />
      </Container>
    </div>
  );
};

export default TAGrading;
