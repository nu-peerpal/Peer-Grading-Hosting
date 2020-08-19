module.exports = (sequelize, Sequelize) => {
  const Assignments = sequelize.define("assignments", {
    assignmentDueDate: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING,
    },
    canvasId: {
      type: Sequelize.STRING,
    },
    peerreviewDueDate: {
      type: Sequelize.DATE,
    },
    appealsDueDate: {
      type: Sequelize.DATE,
    },
    graded: {
      type: Sequelize.BOOLEAN,
    },
  });
  Assignments.associate = (db) => {
    Assignments.belongsTo(db.courses, {
      foreignKey: "courseId",
    });
    Assignments.belongsTo(db.rubrics, {
      foreignKey: "reviewrubricId",
    });

    Assignments.belongsTo(db.rubrics, {
      foreignKey: "rubricId",
    });

    Assignments.hasMany(db.peer_matchings);
    Assignments.hasMany(db.assignment_submissions);
    Assignments.hasMany(db.review_grades);
    Assignments.hasMany(db.review_reports);
    Assignments.hasMany(db.groups);
    Assignments.hasMany(db.peer_review_status);
  };
  return Assignments;
};
