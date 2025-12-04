const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

title: {
    type: DataTypes.STRING(255),
  },

location: {
    type: DataTypes.STRING(255),
  },

experience_years: {
    type: DataTypes.INTEGER,
  },

resume_url: {
    type: DataTypes.STRING(500),
  },

portfolio_url: {
    type: DataTypes.STRING(500),
  },

linkedin_url: {
    type: DataTypes.STRING(500),
  },

github_url: {
    type: DataTypes.STRING(500),
  },

bio: {
    type: DataTypes.TEXT,
  },

salary_expectation_min: {
    type: DataTypes.INTEGER,
  },

salary_expectation_max: {
    type: DataTypes.INTEGER,
  },

preferred_job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
  },

available_from: {
    type: DataTypes.DATE,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

user_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'candidates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = Candidate;
