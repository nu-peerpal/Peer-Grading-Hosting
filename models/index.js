const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres"
); // Example for postgres

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//require all tables for database
db.enrollment = require("./Enrollment.js")(sequelize, Sequelize);

//write all connections here. ex:
/*
db["User"].hasMany(db["Message"], { as: "Users" });
db["User"].belongsToMany(db["User"], {
  as: "Friend",
  through: db["Friendship"],
});
*/
//exporting database
module.exports = db;
