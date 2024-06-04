'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill first name"
          }
        }
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill last name"
          }
        }
      },
      email: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        validate: {
          is: /^(A|B|AB|O)[+-]$/i,
        }
      },
      phone_no: {
        type: Sequelize.BIGINT,
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
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 0
      },
      password: {
        type: Sequelize.STRING,
        // allowNull: false,
        validate: {
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i
        }
      },
      activation_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        // allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      paranoid: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};