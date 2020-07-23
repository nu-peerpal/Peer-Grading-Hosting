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
  });
  Course.associate = (db) => {
    Course.hasMany(db.enrollment);
    //Course.hasMany(db.assignments);
  };

  return Course;
};
