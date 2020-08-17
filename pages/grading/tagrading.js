import React from "react";
import Link from 'next/link'
import "./tagrading.module.css";
import Container from '../../components/container'
import TAsubmission from '../../components/TAgradingview'

class TAGrading extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // :[
        //   {'name': '', 'info':""},
        //   {'name': '', 'info':""},
        // ],
      }
    }
    render() {
    //   const = this.state
    return (
      <div className="Content">
      <Container name="TA Grading">
        <TAsubmission/>
      </Container>
      </div>
    )
    }
  }
  
  export default TAGrading;
  