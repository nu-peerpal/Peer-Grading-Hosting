module.exports = (sequelize, Sequelize) => {
  const Rubrics = sequelize.define("rubrics", {
    rubric: {
      type: Sequelize.JSON,
    },
  });
  return Rubrics;
};
