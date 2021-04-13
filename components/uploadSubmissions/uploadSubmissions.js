import React, { useState } from "react";
import styles from "../styles/uploads3.module.scss";
import { useUserData } from "../storeAPI";
import Button from "@material-ui/core/Button";
const axios = require("axios");
const exampleDownload = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/files/58/download?download_frd=1&verifier=0FqgeyNiTnQ5SeczOShnAF84xIM6Jm6n4efQ7c96";

const uploadSubmissions = ({ submissions }) => {
    const { userId, courseId, courseName, key, setKey } = useUserData();
    const [submittedDocs, setSubmittedDocs] = useState();

    async function sendSubmissions() {
        // remove duplicates
        function contains(a, id) {
            var i = a.length;
            while (i--) {
               if (a[i].canvasId === id) {
                   return true;
               }
            }
            return false;
        }
        let reduced_subs = []
        submissions.forEach(submission => {
            if (!contains(reduced_subs,submission.canvasId)) {
                reduced_subs.push(submission);
            }
        });
        let res = await axios.post(`/api/uploadSubmissions?type=multiple`, reduced_subs);
        console.log('post res: ',res);
    }

    return (
        <div>
            <Button onClick={() => sendSubmissions()}>
                Approve & Submit
            </Button>
        </div>
    );
};

export default uploadSubmissions;
