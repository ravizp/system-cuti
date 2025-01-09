"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leave.belongsTo(models.Employee, { foreignKey: "EmployeeId" });
    }
  }
  Leave.init(
    {
      EmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dateFrom: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "draft",
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "-",
      },
      recordBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "[]",
      },
    },
    {
      sequelize,
      modelName: "Leave",
    }
  );
  return Leave;
};
