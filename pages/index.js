import React from "react";
import Link from "next/link";

import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";
import useSWR from "swr";
import Announcements from "../server/models/Announcements";
import {
  peerMatch,
  ensureSufficientReviews,
  submissionReports,
  reviewReports,
} from "./api/AlgCalls.js";

const fetcher = (url) => fetch(url, { method: "GET" }).then((r) => r.json());

const PRS = [
  { name: "Peer Review Assignment 3: Online Learning", info: "Due 1/12" },
];
const LIST = [
  { name: "Grade User 1s Submission", info: "Assignment 2: Bid Analysis" },
  { name: "Grade User 2s Submission", info: "Assignment 2: Bid Analysis" },
  { name: "Grade User 3s Submission", info: "Assignment 2: Bid Analysis" },
  { name: "Peer Matching", info: "Assignment 4" },
];
// Algorithm Calls on sample data.  Calls AlgCalls API and prints to console

var js = {
  graders: [3, 1, 2],
  reviews: [
    [
      11,
      112,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      11,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      12,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      12,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      13,
      112,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      13,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      14,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      14,
      120,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      15,
      119,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      15,
      114,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      16,
      115,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      16,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      17,
      118,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      17,
      116,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      18,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      18,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      19,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      19,
      117,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      20,
      117,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      20,
      113,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      1,
      114,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      118,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      113,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      1,
      115,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      2,
      120,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
    [
      2,
      111,
      {
        scores: [
          [0.6, "okay"],
          [0.4, "bad"],
        ],
        comments: "Try harder",
      },
    ],
    [
      3,
      116,
      {
        scores: [
          [0.9, "good"],
          [0.8, "decent"],
        ],
        comments: "Nice Work",
      },
    ],
  ],
  rubric: [
    [50, "Content"],
    [50, "Writing Quality"],
  ],
};
console.log(reviewReports(js.graders, js.reviews, js.rubric).data);

function Dashboard(ISstudent) {
  if (ISstudent.ISstudent == true) {
    var announc = [];
    var todoprs = [];
    const { data: announcement } = useSWR(
      "/api/student/announcements/?courseId=1",
      fetcher
    );
    const { data: todo } = useSWR(
      "/api/student/peerReviews/all?courseId=1&userId=1&current=1",
      fetcher
    );
    if (announcement) {
      announcement.map((x) =>
        announc.push({ name: x.announcement, info: "", data: x })
      );
    }
    if (todo) {
      todo.map((x) =>
        todoprs.push({
          name: x.assignment.name,
          info: x.assignment.peerreviewDueDate,
          data: x,
        })
      );
    }
    return (
      <div class='Content'>
        <ListContainer
          name='Todos'
          data={todoprs}
          student={ISstudent.ISstudent}
          link='/peer_reviews/peerreview'
        />
        <ListContainer
          name='Announcements'
          data={announc}
          student={ISstudent.ISstudent}
          link=''
        />{" "}
        {/*link depends on the announcement*/}
      </div>
    );
  } else if (ISstudent.ISstudent == false) {
    var ToDos = [];
    const { data: todos } = useSWR(
      "/api/ta/to-dos?courseId=1&userId=1",
      fetcher
    );
    if (todos) {
      todos.Peer_Review_ToDo.map((x) =>
        ToDos.push({
          name: "Grade Submission " + x.id,
          info: x.assignment.name,
          data: x,
        })
      );
      todos.Status_Updates.map((x) =>
        ToDos.push({
          name: "Status " + x.peer_review_statuses[0].status,
          info: x.name,
          data: x,
        })
      );
    }
    return (
      <div class='Content'>
        <ListContainer
          name='Todos'
          data={ToDos}
          student={ISstudent.ISstudent}
          link=''
        />{" "}
        {/*link depends on the todo*/}
        <ListContainer
          name='View As Student'
          data={[{ name: "View As", info: "VIEW" }]}
          link=''
        />
        {/*link needs to be figured out later, might always be blank*/}
      </div>
    );
  }
}

export default Dashboard;
