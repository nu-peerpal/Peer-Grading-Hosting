import React from 'react';
import Link from 'next/link'
import styles from "./styles/dashboard.module.css";
import ListContainer from "../components/listcontainer";
import { peerMatch, ensureSufficientReviews, submissionReports, reviewReports} from "./api/AlgCalls.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
      //IsStudent: false,

      Announcements: [
        { name: "Assignment 1 Graded", info: "" },
        { name: "Assignment 3 Peer Review Assignment Released", info: "" },
      ],
      PRs:[
        {'name': 'Peer Review Assignment 3: Online Learning', 'info': "Due 1/12"},
      ],
      List:[
        {'name': 'Grade User 1s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Grade User 2s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Grade User 3s Submission', 'info': "Assignment 2: Bid Analysis"},
        {'name': 'Peer Matching', 'info': "Assignment 4"},
      ],
    };
    //const { data3, error } = useSWR('/api/announcements', fetcher);
    // const {data3, error} = fetch('/api/announcements', { method: 'GET', body: {  
    //      "courseId": 1
    //   }})
    fetch('/api/announcements/?courseId=1', { method: 'GET'});
  }

  // Algorithm Calls on sample data.  Calls AlgCalls API and prints to console
  componentDidMount(){

    var js = {
      "graders":[1,2,3],
      "peers":[11,12,13,14,15,16,17,18,19,20],
      "submissions":[[11,111],[12,112],[13,113],[14,114],[15,115],[16,116],[17,117],[18,118],[19,119],[20,120]],
      "peer_load":2,
      "grader_load":3
    }
    peerMatch(js.graders, js.peers, js.submissions, js.peer_load, js.grader_load).then(data=>console.log("PeerMatch", data))
    js = {
      "graders": [1, 3, 2],
      "reviews": [[11, 115, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [11, 112, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [12, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [12, 117, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [13, 111, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [13, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [14, 115, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [14, 112, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [15, 119, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [15, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [16, 111, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [16, 113, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [17, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [17, 120, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [18, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [18, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [19, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [19, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [20, 118, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [20, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [1, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [2, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [3, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}]],
      "matching": [[11, 114], [11, 120], [12, 114], [12, 118], [13, 115], [13, 119], [14, 113], [14, 117], [15, 114], [15, 111], [16, 117], [16, 118], [17, 115], [17, 119], [18, 115], [18, 120], [19, 115], [19, 116], [20, 117], [20, 112], [1, 115], [2, 114], [3, 117]]
    }  
    ensureSufficientReviews(js.graders, js.reviews, js.matching).then(data=>console.log("SufficientReviews", data))
    js = {
      "graders":  [3, 1, 2], 
      "reviews":  [[11, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [11, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [12, 119, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [12, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [13, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [13, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [14, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [14, 120, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [15, 119, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [15, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [16, 115, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [16, 113, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [17, 118, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [17, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [18, 114, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [18, 111, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [19, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [19, 117, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [20, 117, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [20, 113, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [1, 114, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [2, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [3, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [1, 115, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [2, 120, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [2, 111, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [3, 116, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}]],
      "rubric":  [[50, "Content"], [50, "Writing Quality"]]
      }
    submissionReports(js.graders, js.reviews, js.rubric, js.num_rounds, js.bonus).then(data=>console.log("SubmissionReports", data))
    js = {
      "graders":  [3, 1, 2], 
      "reviews":  [[11, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [11, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [12, 119, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [12, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [13, 112, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [13, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [14, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [14, 120, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [15, 119, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [15, 114, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [16, 115, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [16, 113, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [17, 118, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [17, 116, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [18, 114, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [18, 111, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [19, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [19, 117, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [20, 117, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [20, 113, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [1, 114, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [2, 118, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [3, 113, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [1, 115, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [2, 120, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}], [2, 111, {"scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder"}], [3, 116, {"scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work"}]],
      "rubric":  [[50, "Content"], [50, "Writing Quality"]]
      }
    reviewReports(js.graders, js.reviews, js.rubric).then(data=>console.log("ReviewReports", data))
  }

  render() {
    const isStudent = this.props.ISstudent;
    const data2 = this.state.Announcements;
    const data1 = this.state.PRs;
    const data = this.state.List;
    // console.log(fetch('/api/announcements/?courseId=1', { method: 'GET'}));
    //console.log(this.state)
    //console.log(data3)
    let dash;

    if (isStudent) {
      dash = StudentView(data1, data2, isStudent);
    } else {
      dash = TeacherView(data, isStudent);
    }

    return (
      <div>
        {dash}
      </div>
    );
  }
}

function StudentView(x, y, v) {
  return (
    <div className="Content">
      <ListContainer name="Todos" data={x} student={v}/>
      <ListContainer name="Announcements" data={y} student={v}/>
    </div>
  );
}

function TeacherView(w, j) {
  return (
    <div className="Content">
      <ListContainer name="Todos" data={w} student={j}/>
      <ListContainer
        name="View As Student"
        data={[{ name: "View As", info: "VIEW" }]}
      />
    </div>
  );
}

export default Dashboard;