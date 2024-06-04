'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_sessions.belongsTo(models.users, { foreignKey: 'u_id' })
    }
  }
  user_sessions.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        as: 'u_id'
      },
      validate: {
        isInt: {
          msg: "language table foreign key must be integer"
        },
      }
    },
    jwt_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIP: {
          msg: "ip format is not valid"
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      // allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'user_sessions',
    paranoid: true
  });
  return user_sessions;
};