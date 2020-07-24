import React from 'react';
import styles from "./styles/assignedpr.module.css";
import ListContainer from '../components/listcontainer';

class assignedPRS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      Current: [
        { 'name': 'Assignment 3: Online Learning', 'info': "Due 1/12" },
      ],
      Past: [
        { 'name': 'Assignment 1', 'info': "Graded" },
        { 'name': 'Assignment 2', 'info': "" },
      ],
    }
  }
  render() {
    const Current = this.state.Current
    const Past = this.state.Past
    
    return (
      <div className="Content">
        <ListContainer name="Current Peer Reviews" data={Current}/>
        <ListContainer name="Past Peer Reviews" data={Past}/>
      </div>
    )
  }
}


export default assignedPRS;