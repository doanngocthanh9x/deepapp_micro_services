const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobTag = sequelize.define('JobTag', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

tag_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

job_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'job_tags',
  timestamps: false,
  // indexes can be added manually
});

module.exports = JobTag;
