module.exports = (sequelize, Sequelize) => {
  const Enrollment = sequelize.define("enrollment", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    // published: {
    //   type: Sequelize.BOOLEAN,
    // },
  });
  return Enrollment;
};
