const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const Post = require('./Post');

class Problem extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      problem_key: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true // 기본키
      },
      post_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Post',
          key: 'post_key'
        },
        onDelete: 'CASCADE' // 게시글이 삭제되면 관련된 문제도 삭제됨
      },
      problem_text: {
        type: DataTypes.TEXT,
        allowNull: false // 문제 텍스트는 반드시 있어야 함
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Problem',
      tableName: 'Problem',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }

  // associate 함수 추가
  static associate(models) {
    this.belongsTo(models.Post, {
      foreignKey: 'post_key',
      as: 'post',
      onDelete: 'CASCADE',
    });
    this.hasMany(models.Answer, {
      foreignKey: 'problem_key',
      as: 'answers',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Problem;