'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define('UserSession', {
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    token: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ip: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    started_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    expires_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'user_sessions',
    underscored: true,
  });
  UserSession.associate = function (models) {
    // associations can be defined here
    UserSession.belongsTo(models.User);
  };
  return UserSession;
};
