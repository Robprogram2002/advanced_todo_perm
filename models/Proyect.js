const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Proyect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User);
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
      titulo: {
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
        values: ['azul', 'anaranjado', 'rojo', 'verde', 'rosado', 'morado'],
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
