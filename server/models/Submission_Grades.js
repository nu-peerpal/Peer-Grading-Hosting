module.exports = (sequelize, Sequelize) => {
  const Submission_Grades = sequelize.define("submission_grades", {
    assignment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    grade: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
};

return Review_Grades;
