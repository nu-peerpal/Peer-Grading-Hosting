module.exports = (sequelize, Sequelize) => {
    const User_Submissions = sequelize.define("user_submissions", {});
  
    User_Submissions.associate = (db) => {
        User_Submissions.belongsTo(db.users, {
        foreignKey: "userId",
      });
      User_Submissions.belongsTo(db.assignment_submissions, {
        foreignKey: "submissionId",
      });
      User_Submissions.belongsTo(db.assignments, {
        foreignKey: "assignmentId",
      });
    };
  
    return User_Submissions;
  };
  