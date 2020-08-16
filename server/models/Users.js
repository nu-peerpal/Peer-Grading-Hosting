module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    canvasId: {
      //maybe unique?
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
    },
  });
  Users.associate = (db) => {
    Users.hasMany(db.enrollments);
    Users.hasMany(db.review_reports);
  };
  return Users;
};
