var Sequelize = require('sequelize');

module.exports = {
    instance: function(orm) {
        task = orm.define('Tasks', {
            content: Sequelize.STRING,
            parent: Sequelize.INTEGER,
            is_completed: Sequelize.BOOLEAN
        });

        orm.sync();
        return task;
    }
}
