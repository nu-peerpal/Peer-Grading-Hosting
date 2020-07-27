module.exports = (sequelize, Sequelize) => {
  const Assignment_Submissions = sequelize.define("assignment_submissions", {
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
  Assignment_Submissions.associate = (db) => {
    Assignment_Submissions.belongsTo(db.group, {
      foreignKey: "groupId",
    });
    Assignment_Submissions.belongsTo(db.assignment, {
      foreignKey: "assignmentId",
    });

    Assignment_Submissions.hasMany(db.submission_grades);
    Assignment_Submissions.hasMany(db.submission_reports);
    Assignment_Submissions.hasMany(db.review_reports);
  };
  return Assignment_Submissions;
};
