import React from "react";
import styles from "./styles/assignedpr.module.css";
import ListContainer from "../components/listcontainer";
import Assignments from '../server/models/Assignments';
import useSWR from 'swr'

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())


function assignedPRS() {
  //all = []
  var current = []
  var past = []
  const { data: all } = useSWR('/api/assignments/?courseId=1', fetcher)
  console.log(all)
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
