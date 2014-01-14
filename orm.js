var Sequelize = require('sequelize');

module.exports = {
    configure: function(db) {
        return new Sequelize(db.name, db.user, db.password, db.options);
    }
}
