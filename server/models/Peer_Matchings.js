module.exports = (sequelize, Sequelize) => {
  const Peer_Matchings = sequelize.define("peer_matchings", {
    review: {
      type: Sequelize.JSON,
    },
    matching_type: {
      type: Sequelize.STRING,
    },
  });
  Peer_Matchings.associate = (db) => {
    Peer_Matching.belongsTo(db.users, {
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
