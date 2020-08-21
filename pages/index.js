import React from "react";
import Link from "next/link";

import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";
import useSWR from "swr";
import Announcements from "../server/models/Announcements";

const fetcher = (url) => fetch(url, { method: "GET" }).then((r) => r.json());

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
          { name: x.assignment.name, info: x.assignment.peerreviewDueDate, data: x }
        )
      )
    }
    return (
      <div class="Content">
        <ListContainer name="Todos" data={todoprs} student={ISstudent.ISstudent} link="/peer_reviews/peerreview" />
        <ListContainer name="Announcements" data={announc} student={ISstudent.ISstudent} link="" /> {/*link depends on the announcement*/}
      </div>
    );
  } else if (ISstudent.ISstudent == false) {
    var ToDos = []
    const { data: todos } = useSWR('/api/ta/to-dos?courseId=1&userId=1', fetcher)
    if (todos) {
      todos.Peer_Review_ToDo.map(x =>
        ToDos.push(
          { name: ('Grade Submission ' + x.id), info: x.assignment.name, data: x }
        )
      )
      todos.Status_Updates.map(x =>
        ToDos.push(
          { name: 'Status '+ x.peer_review_statuses[0].status, info: x.name, data: x }
        )
      )
    }
    console.log('well well well', ToDos)
    return (
      <div class="Content">
        <ListContainer name="Todos" data={ToDos} student={ISstudent.ISstudent} link="" /> {/*link depends on the todo*/}
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
          link=""
        />{/*link needs to be figured out later, might always be blank*/}
      </div>
    );
  }
}

export default Dashboard;
