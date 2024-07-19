module.exports = (sequelize, Sequelize) => {
  const UserIDMap = sequelize.define("useridmap", {
    canvasUserId: {
      type: Sequelize.STRING,
    },
    canvasCourseId: {
      type: Sequelize.STRING,
    },
    canvasAPIDomain: {
      type: Sequelize.STRING,
    },
    peerPalUserId: {
      type : Sequelize.STRING,
    }
  });


  return UserIDMap;
};
