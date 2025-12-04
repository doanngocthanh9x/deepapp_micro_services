const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

is_read: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

application_id: {
    type: DataTypes.INTEGER,
  },

sender_id: {
    type: DataTypes.INTEGER,
  },

receiver_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'messages',
  timestamps: false,
  // indexes can be added manually
});

module.exports = Message;
