const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CandidateSkill = sequelize.define('CandidateSkill', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

skill_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

proficiency_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
  },

years_of_experience: {
    type: DataTypes.INTEGER,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

candidate_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'candidate_skills',
  timestamps: false,
  // indexes can be added manually
});

module.exports = CandidateSkill;
