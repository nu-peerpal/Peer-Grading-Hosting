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
    canvasKey: {
      type: Sequelize.STRING,
    },
    bonusPercent: {
      type: Sequelize.INTEGER,
    },
    reviewRubric: {
      type: Sequelize.JSON,
    },
    matchingSettings: {
      type: Sequelize.JSON,
    },
    assignmentGroup: {
      type: Sequelize.JSON,
    },
    matchingAlgo: {
      type: Sequelize.STRING,
    },
    subGradeAlgo: {
      type: Sequelize.STRING,
    },
    prGradeAlgo: {
      type: Sequelize.STRING,
    },
    addMatchAlgo: {
      type: Sequelize.STRING,
    },
    peerLoad: {
      type: Sequelize.INTEGER,
    },
    graderLoad: {
      type: Sequelize.INTEGER,
    },
    assignmentName: {
      type: Sequelize.STRING,
    },
    tas: {
      type: Sequelize.JSON,
    },
    prDueDate: {
      type: Sequelize.DATE,
    },
    appealDueDate: {
      type: Sequelize.DATE,
    },
    assignmentDateToPrDate: {
      type: Sequelize.INTEGER,
    },
    prDateToAppealDate: {
      type: Sequelize.INTEGER,
    },
  });

  // Courses.associate = (db) => {
  //   Courses.hasMany(db.assignments);
  //   Courses.hasMany(db.announcements);
  //   Courses.hasMany(db.course_enrollments);
  // };

  return Courses;
};
