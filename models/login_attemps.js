'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class login_attemps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      login_attemps.belongsTo(models.users, { foreignKey: 'u_id' })
    }
  }
  login_attemps.init({
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
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    DeletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'login_attemps',
    paranoid: true
  });
  return login_attemps;
};