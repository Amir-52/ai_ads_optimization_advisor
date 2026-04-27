'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Campaign.belongsTo(models.User,
        {
          foreignKey: 'user_id',
          as: 'user' // ini untuk memudahkan saat kita melakukan fetch data
        }
      );
    }
  }
  Campaign.init({
    user_id: DataTypes.INTEGER,
    campaign_name: DataTypes.STRING,
    platform: DataTypes.STRING,
    impressions: DataTypes.INTEGER,
    clicks: DataTypes.INTEGER,
    conversions: DataTypes.INTEGER,
    spend: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    ai_analysis: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};