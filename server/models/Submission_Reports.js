module.exports = (sequelize, Sequelize) => {
  const Submission_Reports = sequelize.define("submission_reports", {
    report: {
      type: Sequelize.JSON,
    },
  });

  Submission_Reports.associate = (db) => {
    Submission_Reports.belongsTo(db.submisison, {
      foreignKey: "submissionId",
    });
    /*
    Submission_Reports.belongsTo(db.group, {
      foreignKey: "groupId",
    });
    */
  };
  return Submission_Reports;
};
