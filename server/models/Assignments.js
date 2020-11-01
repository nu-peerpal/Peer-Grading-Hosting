module.exports = (sequelize, Sequelize) => {
  const Assignments = sequelize.define("assignments", {
    assignmentDueDate: {
      type: Sequelize.DATE,
    },
    appealsDueDate: {
      type: Sequelize.DATE,
    },
    reviewDueDate: {
      type: Sequelize.DATE,
    },
    reviewStatus: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    canvasId: {
      type: Sequelize.STRING,
    },
    reviewCanvasId: {
      type: Sequelize.STRING,
    },
    graded: {
      type: Sequelize.BOOLEAN,
    },
    rubricId: {
      type: Sequelize.INTEGER,
    },
    reviewRubricId: {
      type: Sequelize.INTEGER,
    },
  });

  Assignments.associate = (db) => {
    Assignments.belongsTo(db.courses, {
      foreignKey: "courseId",
    });
    Assignments.belongsTo(db.rubrics, { as: "rubric" });
    Assignments.belongsTo(db.rubrics, { as: "reviewRubric" });
    Assignments.hasMany(db.peer_matchings);
    Assignments.hasMany(db.assignment_submissions);
    Assignments.hasMany(db.review_grades_reports);
    Assignments.hasMany(db.groups);
  };
  return Assignments;
};
