import React from "react";
import Link from 'next/link'
import Container from './container'
import styles from './styles/assignmentchecklist.module.css'

class assignmentchecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // :[
      //   {'name': '', 'info':""},
      //   {'name': '', 'info':""},
      // ],
    }
  }
  render() {
    //   const = this.state
    return (
      <div>
        <div className={styles.header}>Assignment Checklist</div>
        <div>Peer Reviews: </div>{/*Says disabled or enabled*/}
        <div>Due Date: </div>{/*Fill in*/}
        <div>Peer Matching: <Link href={"/assignments/matching"}>View</Link>
        </div>
        <div>Review Due Date: </div>{/*Fill in*/}
        <div>Check Reviews: <Link href={"/assignments/checkmatching"}>View</Link>
        </div>
        <div>TA Grading: </div>{/*Will just be a list of submissions that shows if they have been graded or not*/}
        <div>Review Grading: <Link href={""}>View</Link></div>
        <div>Submission Grading: <Link href={""}>View</Link></div>
        <div>Appeal Period: </div>{/*Either Not started, Ongoing or Passed*/}
      </div>
    )
  }
}

export default assignmentchecklist;