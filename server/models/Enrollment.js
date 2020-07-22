module.exports = (sequelize, Sequelize) => {
  const Enrollment = sequelize.define("enrollment", {
    enrollment_type: {
      type: Sequelize.STRING,
    },
  });

  Enrollment.associate = (db) => {
    //enrollments belong to a course
    Enrollment.belongsTo(db.course, {
      foreignKey: "courseId",
    });
    //Enrollments belong to a user
    Enrollment.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Enrollment;
};
