import React from 'react';
import styles from "./styles/grades.module.css";
import ListContainer from '../components/listcontainer';

class Grades extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props)
    this.state = {
      
      PR: [
        { 'name': 'Peer Review: Assignment 1', 'info': "96/100" },
      ],
      Assign: [
        { 'name': 'Assignment 1', 'info': "96/100" },
      ],
    }
  }
  render() {
    const PR = this.state.PR
    const Assign = this.state.Assign
    
    // console.log(this.state)
    return (
      <div className="Content">
        <ListContainer name="Graded Peer Reviews" data={PR}/>
        <ListContainer name="Graded Assignments" data={Assign}/>
      </div>
    )
  }
}


export default Grades;