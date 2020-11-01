import React from "react";
// import styles from "./checkmatching.module.css";
import Container from '../../components/container'
import Tree from '../../components/tree'
import { ensureSufficientReviews } from "../api/AlgCalls.js";
import useSWR from "swr";

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

const js = {
  "graders": [1, 3, 2],
  "reviews": [[11, 115, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [11, 112, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [12, 113, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [12, 117, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [13, 111, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [13, 116, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [14, 115, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [14, 112, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [15, 119, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [15, 116, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [16, 111, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [16, 113, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [17, 112, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [17, 120, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [18, 112, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [18, 114, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [19, 113, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [19, 114, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [20, 118, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [20, 116, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [1, 112, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }], [2, 116, { "scores": [[0.6, "okay"], [0.4, "bad"]], "comments": "Try harder" }], [3, 113, { "scores": [[0.9, "good"], [0.8, "decent"]], "comments": "Nice Work" }]],
  "matching": [[11, 114], [11, 120], [12, 114], [12, 118], [13, 115], [13, 119], [14, 113], [14, 117], [15, 114], [15, 111], [16, 117], [16, 118], [17, 115], [17, 119], [18, 115], [18, 120], [19, 115], [19, 116], [20, 117], [20, 112], [1, 115], [2, 114], [3, 117]]
}

var graders = []
var reviews = []
var matching = []

function CheckMatching() {
  const { data: checkmatchingdata } = useSWR('/api/alg/ensureSufficient?courseId=1&assignmentId=1', fetcher)
  if (checkmatchingdata) {
    graders = []
    reviews = []
    matching = []
    checkmatchingdata.Graders.map(x => graders.push(x.id))
    checkmatchingdata.Matchings.map(x => matching.push([x.userId, x.submissionId]))
    checkmatchingdata.Reviews.map(x => reviews.push([x.userId, x.submissionId, x.review]))
    console.log('Well well well', graders, matching, reviews)
  }
    const AdditionalMatches = ensureSufficientReviews(graders, reviews, matching)
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   }
  //   ensureSufficientReviews(js.graders, js.reviews, js.matching).then(data => {
  //     this.setState({ 'matching': data })
  //   })
  // }
  // render() {
  //const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
  return (
    <div className="Content" >
      <Container name="Additional Matches">
        <Tree response={AdditionalMatches || ''} />
      </Container>
    </div>
  );
  // }
}

export default CheckMatching;
