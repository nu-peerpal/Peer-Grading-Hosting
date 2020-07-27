module.exports = (sequelize, Sequelize) => {
  const Peer_Matching = sequelize.define("peer_matching", {
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
  Peer_Matching.associate = (db) => {
    Peer_Matching.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });
    Peer_Matching.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });

    Peer_Matching.hasMany(db.submission_grades);
    Assignment_Submissions.hasMany(db.submission_reports);
    Assignment_Submissions.hasMany(db.review_reports);
  };
  return Assignment_Submissions;
};
