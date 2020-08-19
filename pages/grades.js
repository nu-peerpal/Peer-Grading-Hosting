import React from 'react';
import styles from "./styles/grades.module.css";
import ListContainer from '../components/listcontainer';
import useSWR from 'swr'

// class Grades extends React.Component {
//   constructor(props) {
//     super(props);
//     //console.log(props)
//     this.state = {

//       PR: [
//         { 'name': 'Peer Review: Assignment 1', 'info': "96/100" },
//       ],
//       Assign: [
//         { 'name': 'Assignment 1', 'info': "96/100" },
//       ],
//     }
//   }
//   render() {
//     const PR = this.state.PR
//     const Assign = this.state.Assign

//     // console.log(this.state)
//     return (
//       <div className="Content">
//         <ListContainer name="Graded Peer Reviews" data={PR} link="/grades/viewgrade"/>
//         <ListContainer name="Graded Assignments" data={Assign} link="/grades/viewgrade"/>
//       </div>
//     )
//   }
// }
const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

function Grades() {
  var PRS = []
  var Assignments = []
  const { data: all } = useSWR('/api/graded/all?courseId=1&userId=1', fetcher)
  if (all) {
    all.Graded_Peer_Reviews.map(x => PRS.push({ name: x.name, info: x.review_grades[0].grade, data: x }))
    all.Grade_Assignments.map(x => Assignments.push({ name: x.assignment.name, info: x.submission_grades[0].grade, data: x }))
  }
  // console.log('lets see', Assignments)
  return (
    <div className="Content">
      <ListContainer name="Graded Peer Reviews" data={PRS} link="/grades/viewgrade" />
      <ListContainer name="Graded Assignments" data={Assignments} link="/grades/viewgrade" />
    </div>
  )

}

export default Grades;