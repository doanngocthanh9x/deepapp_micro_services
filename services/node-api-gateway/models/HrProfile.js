const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HrProfile = sequelize.define('HrProfile', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

position: {
    type: DataTypes.STRING(255),
  },

department: {
    type: DataTypes.STRING(100),
  },

is_primary_contact: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

can_post_jobs: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

can_review_applications: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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

employer_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'hr_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = HrProfile;
