const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },

job_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'saved_jobs',
  timestamps: false,
  // indexes can be added manually
});

module.exports = SavedJob;
