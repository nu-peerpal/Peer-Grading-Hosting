module.exports = (sequelize, Sequelize) => {
  const Review_Reports = sequelize.define("review_reports", {
    report: {
      type: Sequelize.JSON,
    },
  });

  Review_Reports.associate = (db) => {
    Review_Reports.belongsTo(db.assignment_submissions, {
      foreignKey: "assignmentSubmissionId",
    });

    Review_Reports.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Review_Reports;
};
