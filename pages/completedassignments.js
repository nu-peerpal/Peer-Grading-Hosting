import React from 'react';
import styles from "./styles/completedassignments.module.css";
import ListContainer from '../components/listcontainer';

class completedAssignments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      Completed:[
        {'name': 'Assignment 1', 'info':"Completed 11/20/20"},
      ],
    }
  }
  render() {
    const Completed = this.state.Completed
    
    return (
      <div className="Content">
        <ListContainer name="Peer Assignments" data={Completed}/>
      </div>
    )
  }
}

export default completedAssignments;