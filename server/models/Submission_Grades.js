module.exports = (sequelize, Sequelize) => {
  const Submission_Grades = sequelize.define("submission_grades", {
    grade: {
      type: Sequelize.INTEGER,
    },
  });

  Submission_Grades.associate = (db) => {
    Submission_Grades.belongsTo(db.assignment_submissions, {
      foreignKey: "assignmentSubmissionId",
    });
  };
  return Submission_Grades;
};
