const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres"
); // Example for postgres

const db = {};

//require all tables for database
db.enrollment = require("./Enrollment")(sequelize, Sequelize);
db.assignment = require("./Assignment")(sequelize, Sequelize);
db.course = require("./Course")(sequelize, Sequelize);
db.assignment_submissions = require("./Assignment_Submissions")(
  sequelize,
  Sequelize
);
db.group = require("./Group")(sequelize, Sequelize);
db.peer_matching = require("./Peer_Matching")(sequelize, Sequelize);
db.peer_review_status = require("./Peer_Review_Status")(sequelize, Sequelize);
db.review_grades = require("./Review_Grades")(sequelize, Sequelize);
db.review_reports = require("./Review_Reports")(sequelize, Sequelize);
db.rubric = require("./Rubric")(sequelize, Sequelize);
db.submission_grades = require("./Submission_Grades")(sequelize, Sequelize);
db.submission_reports = require("./Submission_Reports")(sequelize, Sequelize);
db.users = require("./Users")(sequelize, Sequelize);
db.announcements = require("./Announcements")(sequelize, Sequelize);
//write all connections here. ex:

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

/*
db["User"].hasMany(db["Message"], { as: "Users" });
db["User"].belongsToMany(db["User"], {
  as: "Friend",
  through: db["Friendship"],
});
*/

db.Sequelize = Sequelize;
db.sequelize = sequelize;
//exporting database
module.exports = db;
