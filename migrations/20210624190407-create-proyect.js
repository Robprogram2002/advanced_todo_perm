module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proyects', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        required: true,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          min: 3,
        },
        required: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        values: ['azul', 'anaranjado', 'rojo', 'verde', 'rosado', 'morado'],
      },
      userId: {
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
    await queryInterface.dropTable('proyects');
  },
};
