
module.exports = (sequelize, Sequelize) => {
  const CourseIDMap = sequelize.define("courseidmap", {
    canvasCourseId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canvasAPIDomain: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    peerPalCourseID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canvasId: {
      type: Sequelize.STRING,
    },
    courseName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canvasKey: {
      type: Sequelize.STRING,
    },
  });

  return CourseIDMap;
};
