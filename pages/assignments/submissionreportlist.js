import React from "react";
import Link from 'next/link'
import "./submissionreportlist.module.css";
import Container from '../../components/container'

class SubmissionReports extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    render() {
    //   const = this.state
    return (
      <div className="Content">
      <Container name="Submission Reports for Assignment 1"/>
      </div>
    )
    }
  }
  
  export default SubmissionReports;
  