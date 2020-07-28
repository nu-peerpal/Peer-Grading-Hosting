module.exports = (sequelize, Sequelize) => {
  const Enrollments = sequelize.define("enrollments", {
    enrollment_type: {
      type: Sequelize.STRING,
    },
  });

  Enrollments.associate = (db) => {
    //enrollments belong to a course
    Enrollments.belongsTo(db.courses, {
      foreignKey: "courseId",
    });

    //Enrollments belong to a user
    Enrollments.belongsTo(db.users, {
      foreignKey: "userId",
    });
  };
  return Enrollments;
};
