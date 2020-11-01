module.exports = (sequelize, Sequelize) => {
  const Peer_Matchings = sequelize.define("peer_matchings", {
    review: {
      type: Sequelize.JSON,
    },
    gradedReviewRubric: {
      type: Sequelize.JSON,
    },
    matchingType: {
      type: Sequelize.STRING,
    },
  });

  Peer_Matchings.associate = (db) => {
    Peer_Matchings.belongsTo(db.users, {
      foreignKey: "userId",
    });
    Peer_Matchings.belongsTo(db.assignments, {
      foreignKey: "assignmentId",
    });
    Peer_Matchings.belongsTo(db.assignment_submissions, {
      foreignKey: "submissionId",
    });
  };

  return Peer_Matchings;
};
