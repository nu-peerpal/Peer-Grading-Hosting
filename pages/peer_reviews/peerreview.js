import React from "react";
import Link from 'next/link'
import styles from "./peerreview.module.css";
import Container from '../../components/container';
import Submission from '../../components/submissionview';
//import TextField from '@material-ui/core/TextField';


class PeerReview extends React.Component {
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
      <Container name="Grade User 1's Submission">
        <Submission/>
      </Container>
      </div>
    )
    }
  }
  
  export default PeerReview;
  