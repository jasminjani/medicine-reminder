'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      u_id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIP: {
            msg: "ip format is not valid"
          }
        }
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
    await queryInterface.dropTable('user_sessions');
  }
};