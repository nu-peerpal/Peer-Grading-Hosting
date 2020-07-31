module.exports = (sequelize, Sequelize) => {
  const Courses = sequelize.define("courses", {
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    canvasId: {
      type: Sequelize.STRING,
    },
    courseName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  Courses.associate = (db) => {
    Courses.hasMany(db.enrollments);
    Courses.hasMany(db.assignments);
    Courses.hasMany(db.announcements);
  };

  return Courses;
};
