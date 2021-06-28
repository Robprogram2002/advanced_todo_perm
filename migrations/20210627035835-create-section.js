module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sections', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        required: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          min: 3,
          max: 100,
        },
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: 'enter a valid integer',
          min: 0,
        },
      },
      proyectId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sections');
  },
};
