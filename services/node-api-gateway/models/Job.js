const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

location: {
    type: DataTypes.STRING(255),
  },

job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
  },

category: {
    type: DataTypes.STRING(100),
  },

salary_min: {
    type: DataTypes.INTEGER,
  },

salary_max: {
    type: DataTypes.INTEGER,
  },

salary_currency: {
    type: DataTypes.STRING(10),
    defaultValue: "VND",
  },

excerpt: {
    type: DataTypes.TEXT,
  },

description: {
    type: DataTypes.TEXT,
  },

requirements: {
    type: DataTypes.STRING,
  },

benefits: {
    type: DataTypes.STRING,
  },

apply_url: {
    type: DataTypes.STRING(500),
  },

status: {
    type: DataTypes.ENUM('draft', 'active', 'closed', 'paused'),
    defaultValue: "active",
  },

view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

application_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

expires_at: {
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

employer_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = Job;
