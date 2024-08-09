
module.exports = (sequelize, Sequelize) => {
  const CourseIdMap = sequelize.define("courseidmap", {
    peerPalCourseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    canvasCourseId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canvasAPIDomain: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
    {
      indexes: [{
        unique: true,
        fields: ['canvasCourseId', 'canvasAPIDomain'],
        name: 'unique_canvas_id'
      }]
    }
  );

  return CourseIdMap;
};
