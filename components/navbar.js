import React from "react";
import Link from "next/link";
import styles from "./styles/navbar.module.scss";

class NavControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isStudent = this.props.ISstudent;
    let nav;

    // return student or TA navigation view
    if (isStudent) {
      nav = <StudentView />;
    } else {
      nav = <TeacherView />;
    }

    return <div>{nav}</div>;
  }
}

function StudentView(props) {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        <a>Home</a>
      </Link>
      {/* <Link href={"/assignedreviews"}>
        <a>Assigned Peer Reviews</a>
      </Link> */}
      <Link href={"/grades"}>
        <a>Grades</a>
      </Link>

      <Link href={"/completedassignments"}> 
        <a>Completed Reviews</a>
      </Link>
      {//HOW TO VIEW COMPLETED REVIEWS??? WHERE IS THE LINK??
      }
      {/* <Link href={"/peer_reviews/peerreview"}>
        <a>Peer Reviewing</a>
      </Link> */}
      {/* <Link href={"/grades/viewprgrade"}>
        <a>PR Grade View</a>
      </Link> */}
      {/* <Link href={"/grades/viewassignmentgrade"}>
        <a>Assignment Grade View</a>
      </Link> */}
    </div>
  );
}

function TeacherView(props) {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        <a>Home</a>
      </Link>
      <Link href={"/progressassignments"}>
        <a>In Progress Assignments</a>
      </Link>
      <Link href={"/completedassignments"}>
        <a>Completed Assignments</a>
      </Link>
      {/* <Link href={"/assignments/fullassignmentview/fullassignmentview"}>
        <a>View Assignment Details</a>
      </Link> */}
      <Link href={"/grading/selectAssignment"}>
        <a>TA Grading</a>
      </Link>
      {/* <Link href={"/canvas/canvas"}>
        <a>Canvas</a>
      </Link> */}
      {/* <Link href={"/canvas/canvasSelect"}>
        <a>Canvas Select</a>
      </Link> */}
    </div>
  );
}

export default NavControl;
