import React, { useState } from "react";
import styles from "./styles/uploads3.module.scss";
import { useUserData } from "./storeAPI";
const canvasCalls = require("../canvasCalls");
const axios = require("axios");

const uploadS3 = () => {
    const { userId, courseId, courseName, key, setKey } = useUserData();
    const [submittedDocs, setSubmittedDocs] = useState();

    async function fetchSubmissions() {
        canvasCalls.getSubmissions(canvasCalls.token, 1, 41).then(response => {
            setSubmittedDocs(response);
            axios.get(response[0].submission).then(res => {
                console.log('res: ', res);
            })
        });
        return submittedDocs;
    }


    return (
        <div>
            <div>
                <button onClick={console.log('clicked')}>Remove doc</button>
                {/* <button v-if="!uploadURL" onClick={uploadImage}>Upload image</button> */}
            </div>
            <h2>Success! Doc uploaded to bucket.</h2>
        </div>
    );
};

export default uploadS3;
