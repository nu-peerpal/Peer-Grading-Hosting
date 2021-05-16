const Sequelize = require("sequelize");

let dbUri, options;

if (process.env.NODE_ENV === "test") {
  dbUri = `sqlite:///${process.cwd()}/pages/api/__tests__/test.db`;
  options = {};
} else {
    dbUri = process.env.DB_URI;
  options = {
    ssl: 'Amazon RDS',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  };
}
const sequelize = new Sequelize(dbUri, options); // Example for postgres
const db = {};

//require all tables for database

db.announcements = require("../server/models/Announcements.js")(
  sequelize,
  Sequelize,
);
db.assignments = require("../server/models/Assignments.js")(
  sequelize,
  Sequelize,
);
db.assignment_submissions = require("../server/models/Assignment_Submissions.js")(
  sequelize,
  Sequelize,
);
db.course_enrollments = require("../server/models/Course_Enrollments.js")(
  sequelize,
  Sequelize,
);
db.courses = require("../server/models/Courses.js")(sequelize, Sequelize);
db.groups = require("../server/models/Groups.js")(sequelize, Sequelize);
db.group_enrollments = require("../server/models/Group_Enrollments.js")(
  sequelize,
  Sequelize,
);
db.peer_matchings = require("../server/models/Peer_Matchings.js")(
  sequelize,
  Sequelize,
);
db.review_grades_reports = require("../server/models/Review_Grades_Reports.js")(
  sequelize,
  Sequelize,
);
db.rubrics = require("../server/models/Rubrics.js")(sequelize, Sequelize);
db.users = require("../server/models/Users.js")(sequelize, Sequelize);
db.user_submissions = require("../server/models/User_Submissions")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  console.log("look", db[modelName]);
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

//defining connection function that is called in serv.js
const connect = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // will alter tables based on schema models
  console.log("Connection to the database has been established successfully.");
};

db.connect = connect;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
