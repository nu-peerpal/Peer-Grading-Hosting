module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("course", {
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    canvas_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    course_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  Course.associate = (db) => {
    Course.hasMany(db.enrollment);
    Course.hasMany(db.assignment);
  };

  return Course;
};
