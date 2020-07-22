module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    canvas_id: {
      //maybe unique?
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    first_name: {
      type: Sequelize.STRING,
    },
  });
  Course.associate = (db) => {
    Course.hasMany(db.enrollment);
    Course.hasMany(db.review_reports);
    Course.hasMany(db.review_grades);
    Course.hasMany(db.peer_matching);
  };
  return Users;
};
