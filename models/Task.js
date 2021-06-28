/* eslint-disable no-param-reassign */
const { Model } = require('sequelize');

const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`;

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    getEntity(options) {
      if (!this.entityType) return Promise.resolve(null);
      const mixinMethodName = `get${uppercaseFirst(this.entityType)}`;
      return this[mixinMethodName](options);
    }

    static associate({ Proyect, Section }) {
      this.hasMany(Task, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entityType: 'Task',
        },
      });
      this.belongsTo(Proyect, {
        foreignKey: 'entityId',
        constraints: false,
      });
      this.belongsTo(Section, {
        foreignKey: 'entityId',
        constraints: false,
      });
      this.belongsTo(Task, { foreignKey: 'entityId', constraints: false });
    }
  }
  Task.init(
    {
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
          min: 2,
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
      entityId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
    },
  );

  Task.addHook('afterFind', (findResult) => {
    let tasks = findResult;
    if (!Array.isArray(findResult)) tasks = [findResult];

    tasks.forEach((instance) => {
      if (
        instance.entityType === 'Proyect'
        && instance.Proyect !== undefined
      ) {
        instance.entity = instance.Proyect;
      } else if (
        instance.entityType === 'Section'
        && instance.Section !== undefined
      ) {
        instance.entity = instance.Section;
      } else if (
        instance.entityType === 'Task'
        && instance.Task !== undefined
      ) {
        instance.entity = instance.Task;
      }
      // To prevent mistakes:
      delete instance.Proyect;
      delete instance.dataValues.Proyect;
      delete instance.Section;
      delete instance.dataValues.Section;
      delete instance.Task;
      delete instance.dataValues.Task;
    });
  });

  return Task;
};
