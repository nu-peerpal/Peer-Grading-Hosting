import React from "react";
import Link from 'next/link'
import "./tagrading.module.css";
import Container from '../../components/container'

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
      <Container/>
      </div>
    )
    }
  }
  
  export default TAGrading;
  