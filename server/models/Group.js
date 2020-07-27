module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("group", {
    s3link: {
      type: Sequelize.STRING,
    },
    canvas_id: {
      type: Sequelize.STRING,
    },
    peer_review_due_date: {
      type: Sequelize.DATE,
    },
  });
  Group.associate = (db) => {
    Group.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });

    Group.hasMany(db.assignment_submissions);
  };
  return Group;
};
