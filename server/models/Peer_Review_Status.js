module.exports = (sequelize, Sequelize) => {
  const Peer_Review_Status = sequelize.define("peer_review_status", {
    status: {
      type: Sequelize.STRING,
    },
  });

  Peer_Review_Status.associate = (db) => {
    Peer_Review_Status.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });
  };
  return Peer_Review_Status;
};
