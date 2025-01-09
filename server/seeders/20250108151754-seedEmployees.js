"use strict";
const { hash } = require("../helpers/bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const employees = require("../employees.json");

    employees.forEach((employee) => {
      employee.password = hash(employee.password);
      employee.createdAt = new Date();
      employee.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Employees", employees, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Employees", null, {
      truncate: true,
      casecade: true,
      restartIdentity: true,
    });
  },
};
