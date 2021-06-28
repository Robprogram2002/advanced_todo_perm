const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate({ Proyect, Task }) {
      this.belongsTo(Proyect, { foreignKey: 'proyectId' });
      this.hasMany(Task, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entityType: 'Section',
        },
      });
    }
  }
  Section.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      required: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 100,
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: 'enter a valid integer',
        min: 0,
      },
    },
    proyectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Section',
    tableName: 'sections',
  });
  return Section;
};
