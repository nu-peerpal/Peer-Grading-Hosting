// import React, { useState, useEffect } from "react";
// import Container from "../../components/container";
// import ListContainer from "../../components/listcontainer";
// import SelectReviewAccordian from "../../components/selectreviewaccordian";
// import StudentViewOutline from '../../components/studentViewOutline';
// import { useUserData } from "../../components/storeAPI";
// import { useRouter } from 'next/router';
// const axios = require("axios");
// import _ from "lodash";
// import PeerReviewComponent from "../../components/peerreviewcomponent";

// const SelectReview = (props) => {
//   const router = useRouter();
//   const { userId, courseId, courseName, assignment } = useUserData();
//   const [toDoReviews, setToDoReviews] = useState([]);
//   const { name, id, dueDate, rubricId, reviewStatus } = router.query;
//   useEffect(() => {
//     (async () => {
//         let res = await axios.get(`/api/peerReviews?userId=${userId}&assignmentId=${id}`);
//         // console.log({resData})
//         const peerMatchings = res.data.data;
//         peerMatchings.sort(function(a, b){return a.id-b.id})
//         console.log({peerMatchings});

//         const reviewReviewText = (reviewReview) => {
//           if (!reviewReview)
//             return "";

//           const total = _.sum(reviewReview.reviewBody.map(({points}) => points));
//           const maximum = _.sum(reviewReview.reviewBody.map(({maxPoints}) => maxPoints));

//           return ` (Grade ${total}/${maximum})`;
//         }

//         const toDoReviews = peerMatchings.map((m,i) => ({
//           name: `Submission ${i+1} ${reviewReviewText(m.reviewReview)}`,
//           reviewDueDate: dueDate,
//           rubricId,
//           data: m,
//           reviewStatus: parseInt(reviewStatus),
//           submissionAlias: i+1
//         }));

//       setToDoReviews(toDoReviews)
//     })().catch( e => { console.error(e) });
//   }, []);

//   function StudentToDoList(props) {
//     if (props.toDoReviews) {
//       return <ListContainer
//         textIfEmpty="no peer reviews have been assigned"
//         name={"Reviews for " + name}
//         data={props.toDoReviews}
//         student={props.ISstudent}
//         link="/peer_reviews/peerreview"
//         children={PeerReviewComponent}
//     />
//     } else {
//       return null;
//     }
//   }

//   return (
//     <div className="Content">
//       <Container name="Select Review">
//         <StudentToDoList toDoReviews={toDoReviews} ISstudent={props.ISstudent} />
//         <StudentViewOutline SetIsStudent={props.SetIsStudent} />
//       </Container>
//     </div>
//   );
// };

// export default SelectReview;
import React, { useState, useEffect } from "react";
import Container from "./container";
import ListContainer from "./listcontainer";
import StudentViewOutline from './studentViewOutline';
import AccordionContainer from "./accordioncontainer";
import PeerReviewSubmission from "./peerreviewsubmission";
import { useUserData } from "./storeAPI";
const axios = require("axios");
import _ from "lodash";

const getData = async url => {
  const res = await fetch(url);
  const resData = await res.json();
  return resData.data;
};

const SelectAssignment = (props) => {
//   const router = useRouter();
  const { userId, courseId, courseName, assignment } = useUserData();
  const [toDoReviews, setToDoReviews] = useState([]);
  let {isStudent, submissionId, id, rubricId, matchingId, subId, dueDate} = props;

  if (id == undefined) {
    id = "";
  }

  console.log("HELLO", props.textIfEmpty + " " + JSON.stringify(props));
  useEffect(() => {
    (async () => {
        // let res = await axios.get(`/api/peerReviews?userId=${userId}&assignmentId=${id}`);
        let res = await Promise(`/api/peerReviews?userId=${userId}&assignmentId=${id}`);
        console.log("RES DATA", props.textIfEmpty + " " + JSON.stringify(res));
        const peerMatchings = res.data.data;
        peerMatchings.sort(function(a, b){return a.id-b.id})
        console.log("PEER MATCHINGS", props.textIfEmpty + " " + JSON.stringify(peerMatchings));

        const reviewReviewText = (reviewReview) => {
          if (!reviewReview)
            return "";

          const total = _.sum(reviewReview.reviewBody.map(({points}) => points));
          const maximum = _.sum(reviewReview.reviewBody.map(({maxPoints}) => maxPoints));

          return ` (Grade ${total}/${maximum})`;
        }

        const toDoReviews = peerMatchings.map((m,i) => ({
          name: `Submission ${i+1} ${reviewReviewText(m.reviewReview)}`,
          reviewDueDate: dueDate,
          rubricId,
          data: m,
          reviewStatus: parseInt(reviewStatus),
          submissionAlias: i+1
        }));
      
        console.log("TO DO REVIEWS", props.textIfEmpty + " " + JSON.stringify(toDoReviews))
      setToDoReviews(toDoReviews)
    })().catch( e => { console.error(e) });
  }, []);

  function StudentToDoList(props) {
    if (props.toDoReviews) {
      // return <ListContainer
      return <AccordionContainer
        textIfEmpty="no peer reviews have been assigned"
        name={"Reviews for " + name}
        data={props.toDoReviews}
        student={props.ISstudent}
        link="/peer_reviews/peerreview"
        children={PeerReviewSubmission}
    />
    } else {
      return null;
    }
  }

  return (
    <div className="Content">
        <StudentToDoList toDoReviews={toDoReviews} ISstudent={props.ISstudent} />
        <StudentViewOutline SetIsStudent={props.SetIsStudent} />
    </div>
  );
};

export default SelectAssignment;
