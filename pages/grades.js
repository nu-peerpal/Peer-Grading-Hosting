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
//       <div class="Content">
//         <ListContainer name="Graded Peer Reviews" data={PR} link="/grades/viewprgrade"/>
//         <ListContainer name="Graded Assignments" data={Assign} link="/grades/viewassignmentgrade"/>
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
    // console.log('Ok', all.Graded_Peer_Reviews, all.Graded_Assignments)
    all.Graded_Peer_Reviews.map(x => PRS.push({ name: x.name, info: x.review_grades[0].grade, data: x }))
    all.Graded_Assignments.map(x => Assignments.push({ name: x.assignment.name, info: x.submission_grades[0].grade, data: x }))
  }
  // console.log('lets see', Assignments)
  return (
    <div class="Content">
      <ListContainer name="Graded Peer Reviews" data={PRS} link="/grades/viewprgrade" />
      <ListContainer name="Graded Assignments" data={Assignments} link="/grades/viewassignmentgrade" />
    </div>
  )

}

export default Grades;