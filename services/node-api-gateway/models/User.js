const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

user_type: {
    type: DataTypes.DATE,
    allowNull: false,
  },

full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

phone: {
    type: DataTypes.STRING(20),
  },

avatar_url: {
    type: DataTypes.STRING(500),
  },

is_verified: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

last_login_at: {
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
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = User;
