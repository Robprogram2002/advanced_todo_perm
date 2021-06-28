const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Proyect }) {
      this.hasMany(Proyect, {
        onDelete: 'CASCADE',
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        required: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 6,
          max: 50,
        },
        required: true,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: {
          min: 6,
          max: 50,
        },
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
        defaultValue:
          'https://img.favpng.com/17/1/20/user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm.jpg',
        allowNull: false,
        required: true,
      },
      settingId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      tableName: 'users',
    },
  );
  return User;
};
