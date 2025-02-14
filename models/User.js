const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      user_key: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true // 기본키
      },
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'User',
      tableName: 'User',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }

  // 관계 함수 정의
  static associate(models) {
    // User가 여러 Post를 가질 수 있음 (1:N 관계)
    this.hasMany(models.Post, {
      foreignKey: 'user_key',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = User;