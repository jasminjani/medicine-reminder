'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicines', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill medicine name"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
      },
      medication_timing: {
        type: Sequelize.STRING // like before lunch ,after lunch
      },
      type: {
        type: Sequelize.BOOLEAN, // 0 for one time and 1 for recurring
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "must be date"
          }
        }
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "must be date"
          }
        }
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      recurring_type: {
        type: Sequelize.STRING, // like daily or weekly
      },
      day: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('medicines');
  }
};