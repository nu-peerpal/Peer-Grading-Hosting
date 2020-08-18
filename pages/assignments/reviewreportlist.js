import React from "react";
import Link from 'next/link'
import "./reviewreportlist.module.css";
import Container from '../../components/container'

class ReviewReports extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    render() {
    //   const = this.state
    return (
      <div className="Content">
      <Container name="Review Reports for Assignment 1"/>
      </div>
    )
    }
  }
  
  export default ReviewReports;
  