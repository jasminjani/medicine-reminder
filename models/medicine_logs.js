'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medicine_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      medicine_logs.belongsTo(models.medicines, { foreignKey: 'medicine_id' })
    }
  }
  medicine_logs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medicines',
        key: 'id',
        as: 'medicine_id'
      },
      validate: {
        isInt: {
          msg: "language table foreign key must be integer"
        },
      }
    },
    log_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "must be date"
        }
      }
    },
    log_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    is_done: {
      type: DataTypes.BOOLEAN, // 0 for pending and 1 for mark as done
      defaultValue: 0
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
    modelName: 'medicine_logs',
    paranoid: true
  });
  return medicine_logs;
};