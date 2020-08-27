module.exports = (sequelize, Sequelize) => {
  const Submission_Reports = sequelize.define("submission_reports", {
    report: {
      type: Sequelize.JSON,
    },
  });

  Submission_Reports.associate = (db) => {
    Submission_Reports.belongsTo(db.assignment_submissions, {
      foreignKey: "assignmentSubmissionId",
    });
  };
  return Submission_Reports;
};
