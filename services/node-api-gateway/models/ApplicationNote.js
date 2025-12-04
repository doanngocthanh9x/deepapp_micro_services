const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApplicationNote = sequelize.define('ApplicationNote', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

is_internal: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

application_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'application_notes',
  timestamps: false,
  // indexes can be added manually
});

module.exports = ApplicationNote;
