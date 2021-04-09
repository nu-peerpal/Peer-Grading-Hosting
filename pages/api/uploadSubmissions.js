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
// console.log(process.env.AWS_ID, process.env.AWS_SECRET,process.env.SUBMISSIONS_BUCKET);
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.SUBMISSIONS_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const submissionUpload = async (file) => {
  try {
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
    // console.log(objectParams);
    data = await s3.putObject(objectParams).promise();
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch(err){
    console.log("Error:", err);
  }
}


export default async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
        let fileContent;
        if (req.query.type === "multiple") {
            console.log('multi query');
            console.log('body:', req.body);
        //   await Promise.all(
        //     req.body.map(gradeReport =>
        //       db.review_grades_reports.create(gradeReport),
        //     ),
        //   );
        } else {
          await submissionUpload(req.body.link);
        //   await db.review_grades_reports.create(req.body);
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
