module.exports = (sequelize, Sequelize) => {
  const Rubrics = sequelize.define("rubrics", {
    rubric: {
      type: Sequelize.JSON,
    },
  });

  Rubrics.associate = (db) => {
    Rubrics.hasMany(db.assignments);
  };
  return Rubrics;
};
