'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

  }
  // };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name field is requred'
        },
        notEmpty: {
          msg: 'First name can not be blank'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name is required'
        },
        notEmpty: {
          msg: 'Last name can not be blank'
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The email you entered have been use. Enter a diferent email'
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email address is required'
        },
        notEmpty: {
          msg: 'Email address can not be empty'
        },
        isEmail: {
          msg: 'Provide a valid email'
        },

      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password required'
        },
        notEmpty: {
          msg: 'You must enter a password'
        },
      },
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
    },

  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };


  return User;
};