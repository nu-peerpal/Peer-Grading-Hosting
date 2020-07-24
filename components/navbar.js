import React from 'react';
import Link from 'next/link'
import styles from "./styles/navbar.module.css";


class NavControl extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {IsStudent: false};
  }

  render() {
    const isStudent = this.props.ISstudent;
    console.log(isStudent)
    let nav;

    if (isStudent) {
      nav = <StudentView/>;
    } else {
      nav = <TeacherView/>;
    }

    return (
      <div>
        {nav}
      </div>  
    );
  }
}

function StudentView(props) {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        Dashboard
      </Link>
      <Link href={"/assignedpr"}>
        Assigned Peer Reviews
      </Link>
      <Link href={"/grades"}>
        Grades
      </Link>
    </div>  
  );
}

function TeacherView(props) {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        Dashboard
      </Link>
      <Link href={"/progressassignments"}>
        In Progress Assignments
      </Link>
      <Link href={"/completedassignments"}>
        Completed Assignments
      </Link>
    </div>
  );
}

export default NavControl;
  