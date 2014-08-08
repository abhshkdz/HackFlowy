var Sequelize = require('sequelize');

module.exports = {
    configure: function(db) {
        return new Sequelize(db.database, db.username, db.password, db.options);
    }
}
