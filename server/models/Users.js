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
  });

  Users.associate = (db) => {
    Users.belongsTo(db.courses, {
      foreignKey: "courseId",
    });
    Users.hasMany(db.peer_matchings);
    Users.hasMany(db.review_grades_reports);
    Users.hasMany(db.group_enrollments);
  };

  return Users;
};
