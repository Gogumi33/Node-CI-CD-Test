const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const Problem = require('./Problem'); // Problem 모델 불러오기

class Answer extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      answer_key: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true // 기본키
      },
      problem_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Problem',
          key: 'problem_key'
        },
        onDelete: 'CASCADE'
      },
      answer_text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Answer',
      tableName: 'Answer',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }

  // associate 함수 추가
  static associate(models) {
    this.belongsTo(models.Problem, {
      foreignKey: 'problem_key',
      as: 'problem',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Answer;