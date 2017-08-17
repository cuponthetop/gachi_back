const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

const Test = sequelize.define('Test', {
  name: Sequelize.STRING
});

module.exports = {Test, Sequelize, sequelize};
