var Sequelize = require('sequelize');

/* http://sequelizejs.com/articles/heroku */
var parseUrl = function(url) {
    var match = url.match(/([\w]+):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    db = {
        database : match[6],
        username : match[2],
        password : match[3],
        options  : {
            port     : match[5],
            host     : match[4],
            dialect  : match[1],
        }
    }
    return db;
}

module.exports = {
    configure: function(db) {
        db.url = db.use_env_variable ? process.env[db.use_env_variable] : null;
        db = db.url ? parseUrl(db.url) : db;
        return new Sequelize(db.database, db.username, db.password, db.options);
    }
}

