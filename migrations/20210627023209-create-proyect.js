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
      title: {
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
        values: ['red',
          'blue',
          'light-blue',
          'green',
          'light-green',
          'yellow',
          'orange',
          'brown',
          'purpple',
          'pink',
          'violete',
          'gray',
          'cyan',
          'crimson'],
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
