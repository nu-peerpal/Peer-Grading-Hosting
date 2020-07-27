const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres",
  {
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
); // Example for postgres
const db = {};

//require all tables for database
db.course = require("../server/models/Course.js")(sequelize, Sequelize);
db.enrollment = require("../server/models/Enrollment.js")(sequelize, Sequelize);
db.announcements = require("../server/models/Announcements.js")(
  sequelize,
  Sequelize
);
db.assignment = require("../server/models/Assignment.js")(sequelize, Sequelize);

// db.enrollment = require("../server/models/Enrollment")(sequelize, Sequelize);
// db.assignment_submissions = require("../server/models/Assignment_Submissions")(
//   sequelize,
//   Sequelize
// );
// db.group = require("../server/models/Group")(sequelize, Sequelize);
// db.peer_matching = require("../server/models/Peer_Matching")(sequelize, Sequelize);
// db.peer_review_status = require("../server/models/Peer_Review_Status")(sequelize, Sequelize);
// db.review_grades = require("../server/models/Review_Grades")(sequelize, Sequelize);
// db.review_reports = require("../server/models/Review_Reports")(sequelize, Sequelize);
// db.rubric = require("../server/models/Rubric")(sequelize, Sequelize);
// db.submission_grades = require("../server/models/Submission_Grades")(sequelize, Sequelize);
// db.submission_reports = require("../server/models/Submission_Reports")(sequelize, Sequelize);
// db.users = require("../server/models/Users")(sequelize, Sequelize);

// setting up database connections

Object.keys(db).forEach((modelName) => {
  console.log("look", db[modelName]);
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
//defining connection function that is called in serv.js
const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    if (error.code === "ELIFECYCLE") {
      console.log(util.inspect(error, { showHidden: true, depth: 2 }));
    }
    process.exit(-1);
  }
};

db.connect = connect;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//exporting database

module.exports = db;
