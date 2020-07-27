module.exports = (sequelize, Sequelize) => {
  const Announcements = sequelize.define("announcements", {
    announcement: {
      type: Sequelize.STRING,
    },
  });
  Announcements.associate = (db) => {
    Announcements.belongsTo(db.course, {
      foreignKey: "courseId",
    });
  };
  return Announcements;
};
