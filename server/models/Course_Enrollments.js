module.exports = (sequelize, Sequelize) => {
  const Course_Enrollments = sequelize.define("course_enrollments", {
    enrollment: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    courseId: {
      type: Sequelize.INTEGER,
    }
  });


  // Course_Enrollments.associate = (db) => {
  //   Course_Enrollments.belongsTo(db.users, {
  //     foreignKey: "userId",
  //   });
  //   Course_Enrollments.belongsTo(db.courses, {
  //     foreignKey: "courseId",
  //   });
  // };

  return Course_Enrollments;
};
