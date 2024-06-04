'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicine_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      medicine_id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "must be date"
          }
        }
      },
      log_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      is_done: {
        type: Sequelize.BOOLEAN, // 0 for pending and 1 for mark as done
        defaultValue: 0
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
    await queryInterface.dropTable('medicine_logs');
  }
};