module.exports = (sequelize, Sequelize) => {
  const Groups = sequelize.define("groups", {
    canvasId: {
      type: Sequelize.STRING,
    },
  });
  Groups.associate = (db) => {
    Groups.belongsTo(db.assignments, {
      foreignKey: "assignmentId",
    });
    Groups.belongsToMany(db.users, {
      through: "UserGroup",
    });

    Groups.hasMany(db.assignment_submissions);
  };
  return Groups;
};
