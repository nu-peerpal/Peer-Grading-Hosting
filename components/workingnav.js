import React from 'react';
import Link from 'next/link'
import styles from "./styles/workingnav.module.css";


class NavControl extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {IsStudent: false};
  }

  render() {
    const isStudent = this.props.ISstudent;;
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
    <div className={styles.working}>
      <a>Student Links</a>
      <Link href={"/peer_reviews/peerreview"}>
        Peer Reviewing
      </Link>
      <Link href={"/grades/viewgrade"}>
        Grade View
      </Link>
    </div>  
  );
}

function TeacherView(props) {
  return (
    <div className={styles.working}>
      <a>TA/Prof Links</a>
      <Link href={"/assignments/fullassignmentview"}>
        View Assignment Details
      </Link>
      <Link href={"/grading/tagrading"}>
        TA Grading
      </Link>
    </div>
  );
}

export default NavControl;
  