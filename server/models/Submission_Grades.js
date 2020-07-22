module.exports = (sequelize, Sequelize) => {
  const Submission_Grades = sequelize.define("submission_grades", {
    grade: {
      type: Sequelize.INTEGER,
    },
  });

  Submission_Grades.associate = (db) => {
    Submission_Grades.belongsTo(db.assignment_submission, {
      foreignKey: "submissionId",
    });
  };
  return Submission_Grades;
};
