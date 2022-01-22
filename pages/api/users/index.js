const db = require("../../../models");
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");

import _ from "lodash";

export const config = {
  api: {
    bodyParser: false,
  },
}

const userHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":

        let users = null;
        if (!req.query.courseId) {
          let response = await db.users.findAll();
          users = response.map(({dataValues}) => dataValues);

          // remove enrollments.  these should not be in this table.
          users.forEach(u => {
            users.enrollment = null;
            users.courseId = null;
          });

        } else {
          // the db models are not set up for joins, do do an expensive fake join
          // this needs to be fixed.  --Jason

          let params = {
            courseId: req.query.courseId
          };
          if (req.query.enrollment) {
            params.enrollment = req.query.enrollment;
          }
          if (req.query.canvasId) {
            params.canvasId = req.query.canvasId;
          }

          let enrollments = await db.course_enrollments.findAll({
            where: params
          });
          let response = await db.users.findAll();
          let allUsers = response.map(({dataValues}) => dataValues);

          let enrollmentLookup = _.groupBy(enrollments,({userId}) => userId);

          users = allUsers
            .filter(({id}) => enrollmentLookup[id])
            .map(u => ({
              ...u,
              enrollment: enrollmentLookup[u.id][0].enrollment,
              courseId: enrollmentLookup[u.id][0].courseId,
            }))
        }

        // let users = await db.users.findAll()
        // if (!req.query.courseId) {
        //   throw new Error("Query parameter courseId required");
        // }

        // const courseEnrollmentParams = {
        //   where: { courseId: req.query.courseId }
        // };
        // if (req.query.enrollment) {
        //   courseEnrollmentParams.where.enrollment = req.query.enrollment;
        // }

        // let groupEnrollmentParams = {};
        // if (req.query.groupId) {
        //   groupEnrollmentParams = { where: { groupId: req.query.groupId } };
        // }

        // let users = await db.users.findAll({
        //   where: params,
        //   include: [
        //     {
        //       model: db.course_enrollments,
        //       attributes: ["courseId", "enrollment"],
        //       ...courseEnrollmentParams
        //     },
        //     // {
        //     //   model: db.group_enrollments,
        //     //   attributes: ["groupId"],
        //     //   ...groupEnrollmentParams
        //     // }
        //   ]
        // });
        responseHandler.response200(res, users);
        break;

      case "POST":

        await requestHandler.post(req,res,{table:"users"});

        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    console.log({err});
    responseHandler.response400(res, err);
  }
};

export default userHandler;
