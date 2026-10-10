const database = require("../database");
const { DataTypes } = require("sequelize");
const Products = database.define("products", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});
module.exports = Products;
