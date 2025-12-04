const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CandidateExperience = sequelize.define('CandidateExperience', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

position: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

end_date: {
    type: DataTypes.DATE,
  },

description: {
    type: DataTypes.TEXT,
  },

is_current: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'candidate_experience',
  timestamps: false,
  // indexes can be added manually
});

module.exports = CandidateExperience;
