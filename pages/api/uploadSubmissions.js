const db = require("../../models/index.js");
const responseHandler = require("./utils/responseHandler");
import AWS from 'aws-sdk';
const fs = require('fs');
var crypto = require('crypto');
const axios = require("axios");
export const config = {
  api: {
    bodyParser: false,
  },
}
// set up AWS
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.SUBMISSIONS_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const submissionUpload = async (file) => {
  try {
    if (file.startsWith("http")) { // make sure it is a file upload
      let {data, headers} = await axios.get(file, {responseType: 'stream'});
      let id = crypto.randomBytes(8).toString('hex');
      let link = headers['content-type'];
      let format = link.split("/").pop();
      let key = Date.now() + id + "." + format;
      const objectParams = {
          Bucket: BUCKET_NAME,
          ACL: 'public-read',
          ContentLength: headers['content-length'],
          Body: data,
          ContentType: headers['content-type'],
          Key: key
      };
      data = await s3.putObject(objectParams).promise();
      console.log(`File uploaded successfully. ${key}`);
      return "https://" + BUCKET_NAME + ".s3.us-east-2.amazonaws.com/" + key;
    } else return file; // otherwise just return text
  } catch(err){
    return null;
  }
}


export default async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
        if (req.query.type === "multiple") {
          // if groupId = null, groupId = submitterId
          let submitSubmissions = req.body.map(sub => {
            let group;
            if (!sub.groupId) {
              group = sub.submitterId;
              return {
                assignmentId: sub.assignmentId,
                canvasId: sub.submitterId,
                groupId: group,
                submission: sub.submission,
                submissionType: sub.submissionType,
                submitterId: sub.submitterId
              }
            } else {
              group = sub.groupId;
              return {
                assignmentId: sub.assignmentId,
                canvasId: sub.canvasId,
                groupId: group,
                submission: sub.submission,
                submissionType: sub.submissionType,
                submitterId: sub.submitterId
              }
            }
          });
          await Promise.all(
            submitSubmissions.map(submission => 
              submissionUpload(submission.submission).then(key => {
                db.assignment_submissions.create({
                  canvasId: submission.canvasId,
                  grade: null,
                  report: null,
                  s3Link: key,
                  submissionType: submission.submissionType,
                  assignmentId: submission.assignmentId,
                  groupId: submission.groupId,
                })}),
            ),
          );
        } else {
          await submissionUpload(req.body.submission).then(key => {
            db.assignment_submissions.create({
              canvasId: req.body.canvasId,
              grade: null,
              report: null,
              s3Link: key,
              submissionType: req.body.submissionType,
              assignmentId: req.body.assignmentId,
              groupId: req.body.groupId,
            })
          });
        }
        responseHandler.msgResponse201(
          res,
          "Successfully created database entries.",
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
