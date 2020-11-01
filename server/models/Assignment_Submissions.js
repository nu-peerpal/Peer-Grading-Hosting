module.exports = (sequelize, Sequelize) => {
  const Assignment_Submissions = sequelize.define("assignment_submissions", {
    canvasId: {
      type: Sequelize.STRING,
    },
    grade: {
      type: Sequelize.STRING,
    },
    report: {
      type: Sequelize.JSON,
    },
    s3Link: {
      type: Sequelize.STRING,
    },
  });

  Assignment_Submissions.associate = (db) => {
    Assignment_Submissions.belongsTo(db.assignments, {
      foreignKey: "assignmentId",
    });
    Assignment_Submissions.belongsTo(db.groups, {
      foreignKey: "groupId",
    });
    Assignment_Submissions.hasMany(db.peer_matchings);
  };

  return Assignment_Submissions;
};
