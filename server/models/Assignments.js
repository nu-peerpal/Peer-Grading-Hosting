module.exports = (sequelize, Sequelize) => {
  const Assignments = sequelize.define("assignments", {
    assignment_due_date: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING,
    },
    canvas_id: {
      type: Sequelize.STRING,
    },
    peer_review_due_date: {
      type: Sequelize.DATE,
    },
    appeals_due_date: {
      type: Sequelize.DATE,
    },
  });
  Assignments.associate = (db) => {
    Assignments.belongsTo(db.course, {
      foreignKey: "courseId",
    });
    // Assignments.belongsTo(db.rubrics, {
    //   foreignKey: "review_rubric_id",
    // });

    // Assignments.belongsTo(db.rubrics, {
    //   foreignKey: "rubric_id",
    // });

    // Assignments.hasMany(db.peer_matchings);
    // Assignments.hasMany(db.assignment_submissions);
    // Assignments.hasMany(db.review_grades);
    // Assignments.hasMany(db.groups);
    // Assignments.hasMany(db.peer_review_status);
  };
  return Assignments;
};
