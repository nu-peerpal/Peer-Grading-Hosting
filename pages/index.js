
import React from "react";
import Link from "next/link";

import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";
import { peerMatch, ensureSufficientReviews, submissionReports, reviewReports } from "./api/AlgCalls.js";
import useSWR from 'swr'
import Announcements from '../server/models/Announcements';

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

const PRS = [{'name': 'Peer Review Assignment 3: Online Learning', 'info': "Due 1/12"}]
const LIST = [
          {'name': 'Grade User 1s Submission', 'info': "Assignment 2: Bid Analysis"},
          {'name': 'Grade User 2s Submission', 'info': "Assignment 2: Bid Analysis"},
          {'name': 'Grade User 3s Submission', 'info': "Assignment 2: Bid Analysis"},
          {'name': 'Peer Matching', 'info': "Assignment 4"}
        ]

function Dashboard(ISstudent) {
  if (ISstudent.ISstudent == true) {
    var announc = []
    const { data: announcement } = useSWR('/api/announcements/?courseId=1', fetcher)
    if(announcement){announcement.map(x => announc.push({name: x.announcement, info:"", data: x}))}
    return (
      <div className="Content">
        <ListContainer name="Todos" data={PRS} student={ISstudent.ISstudent} />
        <ListContainer name="Announcements" data={announc} student={ISstudent.ISstudent} />
      </div>
    )
  }
  else if (ISstudent.ISstudent == false) {
    return (
      <div className="Content">
        <ListContainer name="Todos" data={LIST} student={ISstudent.ISstudent} />
        <ListContainer
          name="View As Student"
          data={[{ name: "View As", info: "VIEW" }]}
        />
      </div>
    )
  }
}

export default Dashboard;
