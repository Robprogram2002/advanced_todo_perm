const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Proyect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Section, Task }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
      this.hasMany(Section, { foreignKey: 'proyectId' });
      this.hasMany(Task, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entityType: 'Proyect',
        },
      });
    }
  }
  Proyect.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        required: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 3,
        },
        required: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        values: [
          'red',
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
          'crimson',
        ],
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: 'Proyect',
      tableName: 'proyects',
      timestamps: true,
    },
  );
  return Proyect;
};
