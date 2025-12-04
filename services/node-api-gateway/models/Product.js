const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

description: {
    type: DataTypes.TEXT,
  },

price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },

stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

category: {
    type: DataTypes.STRING(255),
  },

createdAt: {
    type: DataTypes.DATE,
  },

updatedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'products',
  timestamps: false,
  // indexes can be added manually
});

module.exports = Product;
