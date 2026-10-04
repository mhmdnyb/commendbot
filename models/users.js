const database = require("../database");
const { DataTypes } = require("sequelize");
const Users = database.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
  },
});
module.exports = Users;
