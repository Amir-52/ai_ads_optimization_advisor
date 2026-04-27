'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE', // Kalau user id diubah, campaign id juga otomatis berubah
        onDelete: 'CASCADE' // Kalau user dihapus, campaign id juga otomatis dihapus
      },
      campaign_name: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },
      impressions: {
        type: Sequelize.INTEGER
      },
      clicks: {
        type: Sequelize.INTEGER
      },
      conversions: {
        type: Sequelize.INTEGER
      },
      spend: {
        type: Sequelize.DECIMAL
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      ai_analysis: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns');
  }
};