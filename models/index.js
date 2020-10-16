const Sequelize = require("sequelize");

const testing = process.env.NODE_ENV === "test";
const dbUri = testing
  ? `sqlite:///${process.cwd()}/pages/api/__tests__/test.db`
  : "postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres";
const options = testing
  ? {}
  : {
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    };

const sequelize = new Sequelize(dbUri, options); // Example for postgres
const db = {};

//require all tables for database
db.courses = require("../server/models/Courses.js")(sequelize, Sequelize);
db.announcements = require("../server/models/Announcements.js")(
  sequelize,
  Sequelize
);
db.assignments = require("../server/models/Assignments.js")(
  sequelize,
  Sequelize
);

db.assignment_submissions = require("../server/models/Assignment_Submissions.js")(
  sequelize,
  Sequelize
);
db.groups = require("../server/models/Groups.js")(sequelize, Sequelize);
db.peer_matchings = require("../server/models/Peer_Matchings.js")(
  sequelize,
  Sequelize
);
db.peer_review_status = require("../server/models/Peer_Review_Status.js")(
  sequelize,
  Sequelize
);
db.review_grades = require("../server/models/Review_Grades.js")(
  sequelize,
  Sequelize
);
db.review_reports = require("../server/models/Review_Reports.js")(
  sequelize,
  Sequelize
);
db.rubrics = require("../server/models/Rubrics.js")(sequelize, Sequelize);
db.submission_grades = require("../server/models/Submission_Grades.js")(
  sequelize,
  Sequelize
);
db.submission_reports = require("../server/models/Submission_Reports.js")(
  sequelize,
  Sequelize
);
db.users = require("../server/models/Users.js")(sequelize, Sequelize);

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
