const db = require("../../models/index.js");
const responseHandler = require("./utils/responseHandler");
import AWS from 'aws-sdk';
const request = require('request');
export const config = {
    api: {
      bodyParser: false,
    },
  }

export default async (req, res) => {
  try {
    switch (req.method) {
    case "POST":
        if (req.query.type === "multiple") {
            console.log('multi query');
            console.log('api env vars:', process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY);
            console.log('body:', req.body);
        //   await Promise.all(
        //     req.body.map(gradeReport =>
        //       db.review_grades_reports.create(gradeReport),
        //     ),
        //   );
        } else {
            console.log('one query');
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
