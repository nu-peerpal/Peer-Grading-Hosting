import React from 'react';
import styles from "./styles/progressassignments.module.css";
import ListContainer from '../components/listcontainer';

class inProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Progress:[
        {'name': 'Assignment 2: Bid Analysis', 'info':"TA Grading"},
        {'name': 'Assignment 3: Online Learning', 'info':"Peer Review Stage"},
        {'name': 'Assignment 4', 'info':"Peer Matching Required"},
      ],
    }
  }
  render() {
  const Progress = this.state.Progress
  
    return (
      <div className="Content">
      <ListContainer name="Peer Assignments" data={Progress} link={"/assignments/fullassignmentview"}/>
    </div>
    )
  }
}



export default inProgress;