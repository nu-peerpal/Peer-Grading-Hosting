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
  Users.associate = (db) => {
    Users.hasMany(db.enrollment);
    Users.hasMany(db.review_reports);
    Users.hasMany(db.review_grades);
    Users.hasMany(db.peer_matching);
    Users.hasMany(db.Enrollment);
  };
  return Users;
};
