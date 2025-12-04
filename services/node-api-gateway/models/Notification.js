const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

content: {
    type: DataTypes.TEXT,
  },

link: {
    type: DataTypes.STRING(500),
  },

is_read: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

user_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
  // indexes can be added manually
});

module.exports = Notification;
