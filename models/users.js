'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.medicines, { foreignKey: 'u_id' })
      users.hasMany(models.user_sessions, { foreignKey: 'u_id' })
      users.hasMany(models.login_attemps, { foreignKey: 'u_id' })
    }
  }
  users.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "fill first name"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "fill last name"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "fill email"
        },
        isEmail: {
          msg: "email format is not valide"
        },
        isLowercase: {
          args: true,
          msg: "email should be in lowercase"
        }
      }
    },
    blood_group: {
      type: DataTypes.STRING,
      validate: {
        is: /^(A|B|AB|O)[+-]$/i,
      }
    },
    phone_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'fill phone no'
        },
        isInt: {
          args: true,
          msg: "phone no can be only integer value"
        },
        is: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/i
      }
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(1),
      defaultValue: 0
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i
      // }
    },
    activation_code: {
      type: DataTypes.STRING,
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
    deletedAt: {
      // allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'users',
    paranoid: true
  });
  return users;
};