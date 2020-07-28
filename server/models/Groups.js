module.exports = (sequelize, Sequelize) => {
  const Groups = sequelize.define("groups", {
    canvas_id: {
      type: Sequelize.STRING,
    },
  });
  Groups.associate = (db) => {
    Groups.belongsTo(db.assignments, {
      foreignKey: "assignmentId",
    });
    Groups.hasMany(db.users);

    Groups.hasMany(db.assignment_submissions);
  };
  return Groups;
};
