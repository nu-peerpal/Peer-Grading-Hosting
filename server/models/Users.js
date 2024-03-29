module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    canvasId: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    enrollment: {
      type: Sequelize.STRING,
    },
    courseId: {
      type: Sequelize.STRING,
    }
  });

  Users.associate = db => {
    Users.hasMany(db.peer_matchings);
    Users.hasMany(db.review_grades_reports);
    // Users.hasMany(db.group_enrollments);
    Users.hasMany(db.course_enrollments);
  };

  return Users;
};
