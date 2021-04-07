import React, {useState, useEffect} from "react";
import Link from 'next/link'
import Container from './container'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useUserData } from "./storeAPI";
const axios = require("axios");

function assignmentattributes(props) {
  const { userId, courseId, courseName, assignment } = useUserData();
  const [assignmentData, setAssignmentData] = useState({submissionType: null,groupAssignment:null,published:null,ungradedSubmissions:null});
  useEffect(() => {
    axios.get(`/api/canvas/assignments?courseId=${courseId}&assignmentId=${props.assignmentId}`).then(response => {
      setAssignmentData(response.data.data);
    });
  }, [])
  return (
    <List>
        <ListItem>Submission Type: {String(assignmentData.submissionType)}</ListItem>
        <ListItem>Group Assignment: {String(assignmentData.groupAssignment)}</ListItem>
        <ListItem>Published: {String(assignmentData.published)}</ListItem>
        <ListItem>Ungraded Submissions: {assignmentData.ungradedSubmissions}</ListItem>
        {/* <ListItem>Appeals Due:</ListItem> */}
      </List>
  );
}
  
  export default assignmentattributes;