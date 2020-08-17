import React from "react";
import styles from "./styles/assignedpr.module.css";
import ListContainer from "../components/listcontainer";
import Assignments from '../server/models/Assignments';
import useSWR from 'swr'

// class assignedPRS extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       Current: [{ name: "Assignment 3: Online Learning", info: "Due 1/12" }],
//       Past: [
//         { name: "Assignment 1", info: "Graded" },
//         { name: "Assignment 2", info: "" },
//       ],
//     };
//   }
//   render() {
//     const Current = this.state.Current;
//     const Past = this.state.Past;

//     return (
//       <div className="Content">
//         <ListContainer name="Current Peer Reviews" data={Current} />
//         <ListContainer name="Past Peer Reviews" data={Past} />
//       </div>
//     );
//   }
// }
const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

//const CURRENT = [{ name: "Assignment 3: Online Learning", info: "Due 1/12" }]
//const PAST = [{ name: "Assignment 1", info: "Graded" }, { name: "Assignment 2", info: "" },]

function assignedPRS() {
  //all = []
  var current = []
  var past = []
  const { data: all } = useSWR('/api/assignments/?courseId=1', fetcher)
  console.log(all)
  //console.log('is this date current?', new Date('2017-09-28T22:59:02.448804522Z') > new Date())
  if (all) {
    all.map(
      x => 
      {
        if (new Date() < new Date(x.assignmentDueDate))
          current.push({ name: x.name, info: 'Due: ' + new Date(x.assignmentDueDate).toString(), data: x})
        else
          past.push({ name: x.name, info: 'Due: ' + new Date(x.assignmentDueDate).toString(), data: x})
      }
    )
    console.log('lets try',current)
  }
  return (
    <div className="Content">
      <ListContainer name="Current Peer Reviews" data={current} link="/peer_reviews/peerreview"/>
      <ListContainer name="Past Peer Reviews" data={past} link=""/>
    </div>
  )
}

export default assignedPRS;
