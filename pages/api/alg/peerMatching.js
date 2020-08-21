import { assignments, review_grades } from "../../../models/index.js";

const db = require("../../../models/index.js");
const Op = db.Sequelize.Op;
// peer matching algorithm
// requires:
// - submissions&groupId who submitted it & users in that group
// - students in course & ta's in course
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        db.users
          .findAll({
            attributes: ["id", "groupId"],
            where: {
              enrollment: "student",
              courseId: req.query.courseId,
            },
          })
          .then((students) => {
            db.users
              .findAll({
                attributes: ["id"],
                where: {
                  enrollment: "ta",
                  courseId: req.query.courseId,
                },
              })
              .then((ta) => {
                db.assignment_submissions
                  .findAll({
                    attributes: ["id", "groupId"],
                    where: {
                      assignmentId: req.query.assignmentId,
                    },
                  })
                  .then((submissions) => {
                    res.json({
                      Peers: students,
                      Graders: ta,
                      Submissions: submissions,
                    });
                    resolve();
                  });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the peerMatching requirements.",
            });
          });
        break;
      case "POST":
        //post must take the matchings outputted and store with correct assignmentId
        //  & peerMatching with match type specificed in query
        var index;
        console.log("hi");
        var pm = req.body.peerMatchings;
        var args = [].splice.call(pm, 0);
        var argsString = args.join("/");

        function parseTuple(t) {
          var items = t.replace(/^\(|\)$/g, "").split("),(");
          items.forEach(function (val, index, array) {
            array[index] = val.split(",").map(Number);
          });
          return items;
        }

        var data = "(4,7,1),(8,9,6),(3,5,7)";
        console.log(data);
        console.log(argsString);
        var result = parseTuple(data);
        //console.log(JSON.stringify(result));
        // for (index = 0; index < pm.length; ++index) {
        //   console.log(a[index]);
        // }
        resolve();
        break;

      // db.peer_matchings
      //   .update(
      //     {
      //       review: req.body,
      //     },
      //     {
      //       where: { id: req.query.id },
      //       returning: true,
      //       plain: true,
      //     }
      //   )
      //   .then(function (result) {});

      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};
