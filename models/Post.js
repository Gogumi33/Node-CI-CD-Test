const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      post_key: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true // 기본키
      },
      user_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // 외래 키 연결
          key: 'user_key'
        },
        onDelete: 'CASCADE' // 사용자가 삭제되면 관련된 게시글도 삭제됨
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Post',
      tableName: 'Post',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }

  // associate 함수 추가
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_key',
      onDelete: 'CASCADE',
    });
    this.hasMany(models.Problem, {
      as: 'problems',
      foreignKey: 'post_key',
      foreignKey: 'post_key',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Post;