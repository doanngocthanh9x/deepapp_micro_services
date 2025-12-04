const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobAlert = sequelize.define('JobAlert', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

keywords: {
    type: DataTypes.STRING,
  },

locations: {
    type: DataTypes.STRING,
  },

categories: {
    type: DataTypes.STRING,
  },

job_types: {
    type: DataTypes.STRING,
  },

min_salary: {
    type: DataTypes.INTEGER,
  },

is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

frequency: {
    type: DataTypes.ENUM('instant', 'daily', 'weekly'),
    defaultValue: "daily",
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'job_alerts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = JobAlert;
