module.exports = (sequelize, Sequelize) => {
  const Review_Grades = sequelize.define("review_grades", {
    grade: {
      type: Sequelize.INTEGER,
    },
  });

  Review_Grades.associate = (db) => {
    //enrollments belong to a course
    Review_Grades.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });
    //Enrollments belong to a user
    Review_Grades.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Review_Grades;
};
