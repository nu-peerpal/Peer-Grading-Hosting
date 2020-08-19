
import React from "react";
import Link from "next/link";

import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";
import useSWR from 'swr'
import Announcements from '../server/models/Announcements';

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

const PRS = [{ 'name': 'Peer Review Assignment 3: Online Learning', 'info': "Due 1/12" }]
const LIST = [
  { 'name': 'Grade User 1s Submission', 'info': "Assignment 2: Bid Analysis" },
  { 'name': 'Grade User 2s Submission', 'info': "Assignment 2: Bid Analysis" },
  { 'name': 'Grade User 3s Submission', 'info': "Assignment 2: Bid Analysis" },
  { 'name': 'Peer Matching', 'info': "Assignment 4" }
]

function Dashboard(ISstudent) {
  if (ISstudent.ISstudent == true) {
    var announc = []
    var todoprs = []
    const { data: announcement } = useSWR('/api/announcements/?courseId=1', fetcher)
    const { data: todo } = useSWR('/api/peerReviews/all?courseId=1&userId=1&current=1', fetcher)
    console.log(todo)
    if (announcement) {
      announcement.map(x =>
        announc.push(
          { name: x.announcement, info: "", data: x }
        )
      )
    }
    if (todo) {
      todo.map(x =>
        todoprs.push(
          { name: x.assignment.name, info: "", data: x.assignment.peerreviewDueDate }
        )
      )
    }


    return (
      <div className="Content">
        <ListContainer name="Todos" data={todoprs} student={ISstudent.ISstudent} link="/peer_reviews/peerreview" />
        <ListContainer name="Announcements" data={announc} student={ISstudent.ISstudent} link="" /> {/*link depends on the announcement*/}
      </div>
    )
  }
  else if (ISstudent.ISstudent == false) {
    return (
      <div className="Content">
        <ListContainer name="Todos" data={LIST} student={ISstudent.ISstudent} link="" /> {/*link depends on the todo*/}
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        />{/*link needs to be figured out later, might always be blank*/}
      </div>
    )
  }
}

export default Dashboard;
