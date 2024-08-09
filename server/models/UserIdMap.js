module.exports = (sequelize, Sequelize) => {
  const UserIdMap = sequelize.define("useridmap", {
    peerPalUserId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    canvasUserId: {
      type: Sequelize.STRING,
    },
    canvasAPIDomain: {
      type: Sequelize.STRING,
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['canvasUserId', 'canvasAPIDomain'],
      name: 'unique_canvas_id'
    }]
  });


  return UserIdMap;
};
