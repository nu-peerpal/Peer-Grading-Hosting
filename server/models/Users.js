const Groups = require("./Groups");

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
    enrollment: {
      type: Sequelize.STRING,
    },
  });
  Users.associate = (db) => {
    Users.belongsTo(db.groups, {
      foreignKey: "groupId",
    });
    Users.belongsTo(db.courses, {
      foreignKey: "courseId",
    });
    Users.hasMany(db.review_reports);
  };
  return Users;
};
