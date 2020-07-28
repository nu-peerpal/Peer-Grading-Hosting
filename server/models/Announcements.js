module.exports = (sequelize, Sequelize) => {
  const Announcements = sequelize.define("announcements", {
    announcement: {
      type: Sequelize.STRING,
    },
  });
  Announcements.associate = (db) => {
    Announcements.belongsTo(db.courses, {
      foreignKey: "courseId",
    });
  };
  return Announcements;
};
