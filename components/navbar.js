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
      nav = <StudentView />;
    } else {
      nav = <TeacherView />;
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
        <a>Dashboard</a>
      </Link>
      <Link href={"/assignedpr"}>
        <a>Assigned Peer Reviews</a>
      </Link>
      <Link href={"/grades"}>
        <a>Grades</a>
      </Link>
    </div>
  );
}

function TeacherView(props) {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        <a>Dashboard</a>
      </Link>
      <Link href={"/progressassignments"}>
        <a>In Progress Assignments</a>
      </Link>
      <Link href={"/completedassignments"}>
        <a>Completed Assignments</a>
      </Link>
    </div>
  );
}

export default NavControl;
