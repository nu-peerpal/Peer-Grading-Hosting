import React from 'react';
import Link from 'next/link'
import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
      //IsStudent: false,

      Announcements: [
        { name: "Assignment 1 Graded", info: "" },
        { name: "Assignment 3 Peer Review Assignment Released", info: "" },
      ],
      PRs:[
        {'name': 'Peer Review Assignment 3: Online Learning', 'info': "Due 1/12"},
      ],
      List:[
        {'name': 'Grade User 1s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Grade User 2s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Grade User 3s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Peer Matching', 'info': "Assignment 4"},
      ],
    };
  }

  render() {
    const isStudent = this.props.ISstudent;
    const data2 = this.state.Announcements;
    const data1 = this.state.PRs;
    const data = this.state.List;
    ;
    // console.log(this.state)
    let dash;

    if (isStudent) {
      dash = StudentView(data1, data2, isStudent);
    } else {
      dash = TeacherView(data, isStudent);
    }

    return (
      <div>
        {dash}
      </div>
    );
  }
}

function StudentView(x, y, v) {
  return (
    <div className="Content">
      <ListContainer name="Todos" data={x} student={v}/>
      <ListContainer name="Announcements" data={y} student={v}/>
    </div>
  );
}

function TeacherView(w, j) {
  return (
    <div className="Content">
      <ListContainer name="Todos" data={w} student={j}/>
      <ListContainer
        name="View As Student"
        data={[{ name: "View As", info: "VIEW" }]}
      />
    </div>
  );
}

export default Dashboard;