import React from "react";
import Link from 'next/link'
import "./viewgrade.module.css";
import Container from '../../components/container'

class ViewGrade extends React.Component {
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
  
  export default ViewGrade;
  