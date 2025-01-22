const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = {}
const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mariadb',
      logging: false
    }
    );
  
// db 객체에 각 모델 및 Sequelize 설정 추가
db.Sequelize = Sequelize;
db.sequelize = sequelize;
  
module.exports = db;