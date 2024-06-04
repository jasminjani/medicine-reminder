'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medicines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      medicines.belongsTo(models.users, { foreignKey: 'u_id' })
      medicines.hasMany(models.medicine_logs, { foreignKey: 'medicine_id' })
    }
  }
  medicines.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "fill medicine name"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
    },
    medication_timing: {
      type: DataTypes.STRING // like before lunch ,after lunch
    },
    type: {
      type: DataTypes.BOOLEAN, // 0 for one time and 1 for recurring
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "must be date"
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "must be date"
        }
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    recurring_type: {
      type: DataTypes.STRING, // like daily or weekly
    },
    day: {
      type: DataTypes.STRING
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
    modelName: 'medicines',
    paranoid: true
  });
  return medicines;
};