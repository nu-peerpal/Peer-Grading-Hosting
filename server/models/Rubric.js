module.exports = (sequelize, Sequelize) => {
  const Rubric = sequelize.define("rubric", {
    rubric: {
      type: Sequelize.JSON,
    },
  });
  return Users;
};
