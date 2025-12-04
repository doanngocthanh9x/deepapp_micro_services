const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CandidateEducation = sequelize.define('CandidateEducation', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

institution: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

degree: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

field_of_study: {
    type: DataTypes.STRING(255),
  },

start_date: {
    type: DataTypes.DATE,
  },

end_date: {
    type: DataTypes.DATE,
  },

gpa: {
    type: DataTypes.DECIMAL,
  },

description: {
    type: DataTypes.TEXT,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'candidate_education',
  timestamps: false,
  // indexes can be added manually
});

module.exports = CandidateEducation;
