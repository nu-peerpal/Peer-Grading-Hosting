import React, { useState } from "react";
import styles from "../styles/uploads3.module.scss";
import { useUserData } from "../storeAPI";
import Button from "@material-ui/core/Button";
const axios = require("axios");
const exampleDownload = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/files/11/download?download_frd=1&verifier=1LOKpEFUrm2NdXpfWLVwBa1S0y9xfFfTCe7BTk1Z";
import AWS from 'aws-sdk';
// AWS.config.loadFromPath('aws.json');
const request = require('request')

const uploadSubmissions = ({ submissions }) => {
    const { userId, courseId, courseName, key, setKey } = useUserData();
    const [submittedDocs, setSubmittedDocs] = useState();

    async function sendSubmissions() {
        let submission = {link: exampleDownload};
        let res = await axios.post(`/api/uploadSubmissions`, submission);
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
