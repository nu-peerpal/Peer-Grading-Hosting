module.exports = (sequelize, Sequelize) => {
  const Review_Grades_Reports = sequelize.define("review_grades_reports", {
    grade: {
      type: Sequelize.FLOAT,
    },
    report: {
      type: Sequelize.JSON,
    },
  });

  Review_Grades_Reports.associate = (db) => {
    Review_Grades_Reports.belongsTo(db.assignments, {
      foreignKey: "assignmentId",
    });
    Review_Grades_Reports.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Review_Grades_Reports;
};
