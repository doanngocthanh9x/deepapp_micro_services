const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employer = sequelize.define('Employer', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

logo_url: {
    type: DataTypes.STRING(500),
  },

website: {
    type: DataTypes.STRING(500),
  },

location: {
    type: DataTypes.STRING(255),
  },

industry: {
    type: DataTypes.STRING(100),
  },

company_size: {
    type: DataTypes.STRING(50),
  },

about: {
    type: DataTypes.TEXT,
  },

founded_year: {
    type: DataTypes.INTEGER,
  },

is_verified: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'employers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = Employer;
