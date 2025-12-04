const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InterviewSchedule = sequelize.define('InterviewSchedule', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

interview_type: {
    type: DataTypes.STRING(50),
  },

scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },

location: {
    type: DataTypes.STRING(255),
  },

interviewer_ids: {
    type: DataTypes.STRING,
  },

status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'),
    defaultValue: "scheduled",
  },

notes: {
    type: DataTypes.TEXT,
  },

feedback: {
    type: DataTypes.TEXT,
  },

rating: {
    type: DataTypes.INTEGER,
  },

created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

application_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'interview_schedules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // indexes can be added manually
});

module.exports = InterviewSchedule;
