import React from "react";
import Link from "next/link";
import styles from "./styles/navbar.module.scss";

function NavControl(props) {
  const isStudent = props.ISstudent;
  let nav;

  // return student or TA navigation view
  if (isStudent) {
    nav = <StudentView />;
  } else {
    nav = <TeacherView />;
  }

  return <div>{nav}</div>;
}

function StudentView() {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        <a className={styles.linkbar}>Home</a>
      </Link>

      {/* <Link href={"/assignedreviews"}>
        <a>Assigned Peer Reviews</a>
      </Link> */}
      {/*}
      <Link href={"/grades"}>
        <a>Grades</a>
      </Link>

      <Link href={"/completedassignments"}>
        <a>Completed Reviews</a>
      </Link>
      */}
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

function TeacherView() {
  return (
    <div className={styles.nav}>
      <Link href={"/"}>
        <a className={styles.linkbar}>Home</a>
      </Link>
      <Link href={"/progressassignments"}>
        <a className={styles.linkbar}>In Progress Assignments</a>
      </Link>
      <Link href={"/completedassignments"}>
        <a className={styles.linkbar}>Completed Assignments</a>
      </Link>
      <Link href={"/grading/selectAssignment"}>
        <a className={styles.linkbar}>TA Grading</a>
      </Link>
      {/* <Link href={"/peerpal/peerpalsettings"}>
        <a>PeerPal Settings</a>
      </Link> */}
    </div>
  );
}

export function NotAuthenticated() {
  return (
    <div className={styles.nav}>
      <p>
        You are not authenticated via Canvas. To access the PeerPal application,
        log in to Canvas, navigate to your peer review assignments in Canvas,
        and click to open the peer review assignment in a new tab.
      </p>
    </div>
  );
}

export default NavControl;
