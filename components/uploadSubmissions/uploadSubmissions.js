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
    console.log('env vars:', process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY);
    const { userId, courseId, courseName, key, setKey } = useUserData();
    const [submittedDocs, setSubmittedDocs] = useState();
    console.log('uploadS3 subs', submissions)
    var myConfig = new AWS.Config({
        credentials: {
            accessKeyId: "",
            secretAccessKey: ""
        }, region: 'us-east-2'
      });
      const s3 = new AWS.S3()
      AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
        // credentials not loaded
        else {
          console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
      });

    function sendSubmissions() {
        var promise = new Promise((resolve, reject) => {
            return request({ url : exampleDownload, encoding : null }, 
            function(err, res, body){
                if(err)
                    return reject({ status:500,error:err })
    
                return resolve({ status:200, body: body})        
            })
        })
        promise.then((pdf) => {
            if(pdf.status == 200)
            {
                console.log('uploading file..')
                s3.putObject({
                    Bucket: 'peer-grading-submissions',
                    Body: pdf.body,
                    Key: 'my-pdf.pdf',
                    ACL:'public-read'
                }, (err,data) => {
                    if(err)
                        console.log(err)
                    else
                        console.log('uploaded')
                })
            }
        })
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
