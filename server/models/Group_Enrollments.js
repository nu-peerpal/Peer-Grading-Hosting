module.exports = (sequelize, Sequelize) => {
  const Group_Enrollments = sequelize.define("group_enrollments", {
    assignmentId: {
      type: Sequelize.INTEGER,
    },
    submissionId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    }
  });

  // Group_Enrollments.associate = (db) => {
  //   Group_Enrollments.belongsTo(db.users, {
  //     foreignKey: "userId",
  //   });
  //   // Group_Enrollments.belongsTo(db.groups, {
  //   //   foreignKey: "groupId",
  //   // });
  // };

  return Group_Enrollments;
};
