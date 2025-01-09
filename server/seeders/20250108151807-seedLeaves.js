"use strict";

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
    const leaves = require("../leaves.json");
    leaves.forEach((leave) => {
      leave.createdAt = new Date();
      leave.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Leaves", leaves, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Leaves", null, {
      truncate: true,
      casecade: true,
      restartIdentity: true,
    });
  },
};
