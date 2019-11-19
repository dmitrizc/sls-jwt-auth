'use strict';
const bcrypt = require('bcryptjs');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');

const {
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  JWT_ACCESS_ENCRYPTION,
  JWT_REFRESH_ENCRYPTION,
} = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    company_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    last_access_date: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'users',
    underscored: true,
  });

  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.UserSession);
  };

  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      let err, hash;
      [err, hash] = await to(bcrypt.hash(user.password, 12));

      if (err) {
        throw err;
      }

      user.password = hash;
    }
  });

  User.prototype.comparePassword = async function (password) {
    if (!this.password) {
      throw Error('User does not have password');
    }

    let err, pass;
    [err, pass] = await to(bcrypt.compare(password, this.password));

    if (err || !pass) {
      throw Error('Invalid password');
    }

    return this;
  };

  User.prototype.getJwt = function (isRefresh = false) {
    let expirationTime = parseInt(isRefresh ? JWT_REFRESH_EXPIRATION : JWT_ACCESS_EXPIRATION);
    return `Bearer ${jwt.sign(
      { userId: this.id },
      isRefresh ? JWT_REFRESH_ENCRYPTION : JWT_ACCESS_ENCRYPTION,
      { expiresIn: expirationTime },
    )}`;
  };

  return User;
};
