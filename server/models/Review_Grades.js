module.exports = (sequelize, Sequelize) => {
  const Review_Grades = sequelize.define("review_grades", {
    grade: {
      type: Sequelize.INTEGER,
    },
  });

  Review_Grades.associate = (db) => {
    Review_Grades.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });
    Review_Grades.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Review_Grades;
};
