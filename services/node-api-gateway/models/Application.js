const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

status: {
    type: DataTypes.ENUM('submitted', 'reviewed', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: "submitted",
  },

cover_letter: {
    type: DataTypes.TEXT,
  },

resume_url: {
    type: DataTypes.STRING(500),
  },

expected_salary: {
    type: DataTypes.INTEGER,
  },

available_from: {
    type: DataTypes.DATE,
  },

current_step: {
    type: DataTypes.STRING(50),
  },

applied_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

job_id: {
    type: DataTypes.INTEGER,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'applications',
  timestamps: false,
  // indexes can be added manually
});

module.exports = Application;
