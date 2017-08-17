const models = require( __dirname + '/models/models');

module.exports = () => {
  models.sequelize.sync({force: false});
}
