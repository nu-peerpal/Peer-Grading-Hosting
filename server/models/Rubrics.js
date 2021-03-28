module.exports = (sequelize, Sequelize) => {
  const Rubrics = sequelize.define("rubrics", {
    rubric: {
      type: Sequelize.JSON,
      canvasId: Sequelize.INTEGER,
    },
  });

  Rubrics.associate = (db) => {
    Rubrics.hasMany(db.assignments);
  };
  return Rubrics;
};
