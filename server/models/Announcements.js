module.exports = (sequelize, Sequelize) => {
  const Announcements = sequelize.define("announcements", {
    announcement: {
      type: Sequelize.STRING,
    },
  });
  Assignment_Submissions.associate = (db) => {
    Assignment_Submissions.belongsTo(db.course, {
      foreignKey: "courseId",
    });
  };
  return Announcements;
};
