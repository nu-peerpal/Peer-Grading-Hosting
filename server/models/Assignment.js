module.exports = (sequelize, Sequelize) => {
  const Assignment = sequelize.define("assignment", {
    assignment_due_date: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING,
    },
    canvas_id: {
      type: Sequelize.STRING,
    },
    peer_review_due_date: {
      type: Sequelize.DATE,
    },
    appeals_due_date: {
      type: Sequelize.DATE,
    },
  });
  Assignment.associate = (db) => {
    /*
    Assignment.belongsTo(db.rubric, {
      foreignKey: "review_rubric_id",
    });
    */
    Assignment.belongsTo(db.course, {
      foreignKey: "courseId",
    });
    /*Assignment.belongsTo(db.rubric, {
      foreignKey: "rubric_id",
    });
    */
    //Assignment.hasMany(db.peer_matching);
    //Assignment.hasMany(db.assignment_submissions);
    //Assignment.hasMany(db.review_grades);
    //Assignment.hasMany(db.group);
    //Assignment.hasMany(db.peer_review_status);
    Assignment.hasMany(db.announcements);
  };
  return Assignment;
};
