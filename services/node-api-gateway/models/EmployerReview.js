const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployerReview = sequelize.define('EmployerReview', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

title: {
    type: DataTypes.STRING(255),
  },

review_text: {
    type: DataTypes.TEXT,
  },

pros: {
    type: DataTypes.TEXT,
  },

cons: {
    type: DataTypes.TEXT,
  },

work_life_balance_rating: {
    type: DataTypes.INTEGER,
  },

salary_benefit_rating: {
    type: DataTypes.INTEGER,
  },

is_anonymous: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

is_verified: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: "pending",
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

user_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'employer_reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = EmployerReview;
