import React from "react";
import Link from 'next/link'
import "./tamatchinglist.module.css";
import Container from '../../components/container'

class TAMatchings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    render() {
    //   const = this.state
    return (
      <div className="Content">
      <Container name="TA Matchings for Assignment 1"/>
      </div>
    )
    }
  }
  
  export default TAMatchings;
  