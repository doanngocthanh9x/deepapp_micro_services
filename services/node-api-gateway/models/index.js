const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

// Dynamically load all model files in this directory (except this index.js)
const models = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath);
    // model.name is the Sequelize model name (if defined)
    const name = (model && model.name) ? model.name : path.basename(file, '.js');
    models[name] = model;
  });

// Optional: define relationships if models exist (keeps previous associations if present)
// Helper to find model by name ignoring case and model.name
function findModel(name) {
  const lname = name.toLowerCase();
  const key = Object.keys(models).find((k) => k.toLowerCase() === lname || (models[k] && models[k].name && models[k].name.toLowerCase() === lname));
  return key ? models[key] : null;
}

const User = findModel('User');
const Candidate = findModel('Candidate');
const Employer = findModel('Employer');
const HRProfile = findModel('HRProfile') || findModel('HrProfile') || findModel('hr_profiles');
const Job = findModel('Job');
const Application = findModel('Application');
const JobTag = findModel('JobTag');
const CandidateSkill = findModel('CandidateSkill');
const CandidateExperience = findModel('CandidateExperience');
const CandidateEducation = findModel('CandidateEducation');
const InterviewSchedule = findModel('InterviewSchedule');
const SavedJob = findModel('SavedJob');
const JobAlert = findModel('JobAlert');
const Notification = findModel('Notification');
const Message = findModel('Message');
const ApplicationNote = findModel('ApplicationNote');
const EmployerReview = findModel('EmployerReview');

if (User && Candidate) {
  User.hasOne(Candidate, { foreignKey: 'user_id' });
  Candidate.belongsTo(User, { foreignKey: 'user_id' });
}

if (User && HRProfile) {
  User.hasOne(HRProfile, { foreignKey: 'user_id' });
  HRProfile.belongsTo(User, { foreignKey: 'user_id' });
}

if (Candidate && CandidateSkill) {
  Candidate.hasMany(CandidateSkill, { foreignKey: 'candidate_id' });
  CandidateSkill.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (Candidate && CandidateExperience) {
  Candidate.hasMany(CandidateExperience, { foreignKey: 'candidate_id' });
  CandidateExperience.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (Candidate && CandidateEducation) {
  Candidate.hasMany(CandidateEducation, { foreignKey: 'candidate_id' });
  CandidateEducation.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (Employer && HRProfile) {
  Employer.hasMany(HRProfile, { foreignKey: 'employer_id' });
  HRProfile.belongsTo(Employer, { foreignKey: 'employer_id' });
}

if (Employer && Job) {
  Employer.hasMany(Job, { foreignKey: 'employer_id' });
  Job.belongsTo(Employer, { foreignKey: 'employer_id' });
}

if (Job && JobTag) {
  Job.hasMany(JobTag, { foreignKey: 'job_id' });
  JobTag.belongsTo(Job, { foreignKey: 'job_id' });
}

if (Job && Application) {
  Job.hasMany(Application, { foreignKey: 'job_id' });
  Application.belongsTo(Job, { foreignKey: 'job_id' });
}

if (Candidate && Application) {
  Candidate.hasMany(Application, { foreignKey: 'candidate_id' });
  Application.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (Application && ApplicationNote) {
  Application.hasMany(ApplicationNote, { foreignKey: 'application_id' });
  ApplicationNote.belongsTo(Application, { foreignKey: 'application_id' });
}

if (Application && InterviewSchedule) {
  Application.hasMany(InterviewSchedule, { foreignKey: 'application_id' });
  InterviewSchedule.belongsTo(Application, { foreignKey: 'application_id' });
}

if (Candidate && SavedJob) {
  Candidate.hasMany(SavedJob, { foreignKey: 'candidate_id' });
  SavedJob.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (Job && SavedJob) {
  Job.hasMany(SavedJob, { foreignKey: 'job_id' });
  SavedJob.belongsTo(Job, { foreignKey: 'job_id' });
}

if (Candidate && JobAlert) {
  Candidate.hasMany(JobAlert, { foreignKey: 'candidate_id' });
  JobAlert.belongsTo(Candidate, { foreignKey: 'candidate_id' });
}

if (User && Notification) {
  User.hasMany(Notification, { foreignKey: 'user_id' });
  Notification.belongsTo(User, { foreignKey: 'user_id' });
}

if (Application && Message) {
  Application.hasMany(Message, { foreignKey: 'application_id' });
  Message.belongsTo(Application, { foreignKey: 'application_id' });
}

if (User && Message) {
  User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
  Message.belongsTo(User, { foreignKey: 'sender_id' });
}

if (Employer && EmployerReview) {
  Employer.hasMany(EmployerReview, { foreignKey: 'employer_id' });
  EmployerReview.belongsTo(Employer, { foreignKey: 'employer_id' });
}

if (User && EmployerReview) {
  User.hasMany(EmployerReview, { foreignKey: 'user_id' });
  EmployerReview.belongsTo(User, { foreignKey: 'user_id' });
}

module.exports = Object.assign({ sequelize }, models);
