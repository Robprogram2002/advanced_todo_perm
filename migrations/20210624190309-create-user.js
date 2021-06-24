module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        required: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          min: 6,
          max: 50,
        },
        required: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
        validate: {
          min: 6,
          max: 50,
        },
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      imageUrl: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true,
        },
        defaultValue:
          'https://img.favpng.com/17/1/20/user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm.jpg',
        allowNull: false,
        required: true,
      },
      settingId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('users');
  },
};
